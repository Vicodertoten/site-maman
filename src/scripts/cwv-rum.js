const DEFAULT_ENDPOINT = '/api/rum/web-vitals';
const DEFAULT_SAMPLE_RATE = 1;

const navigationEntry = performance.getEntriesByType('navigation')[0];
const navigationType = navigationEntry?.type || 'navigate';

const lcpRating = value => {
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
};

const inpRating = value => {
  if (value <= 200) return 'good';
  if (value <= 500) return 'needs-improvement';
  return 'poor';
};

const clsRating = value => {
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
};

function sendMetrics(endpoint, payload) {
  if (!payload.length) return;
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
      return;
    }
  } catch {
    // fallback fetch below
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // intentionally silent
  });
}

function getValueOrDefault(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function initCWVRum({
  endpoint = DEFAULT_ENDPOINT,
  sampleRate = DEFAULT_SAMPLE_RATE,
} = {}) {
  if (window.__cwvRumInitialized) return;
  window.__cwvRumInitialized = true;

  const rate = Math.max(
    0,
    Math.min(1, getValueOrDefault(sampleRate, DEFAULT_SAMPLE_RATE))
  );
  if (Math.random() > rate) return;

  const metricIdPrefix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const queue = [];
  const sentKeys = new Set();

  const enqueue = metric => {
    const key = `${metric.name}:${metric.id}`;
    if (sentKeys.has(key)) return;
    sentKeys.add(key);
    queue.push(metric);
  };

  const flush = () => {
    if (queue.length === 0) return;
    const chunk = queue.splice(0, queue.length);
    sendMetrics(endpoint, chunk);
  };

  let lcpValue = 0;
  let lcpElement = '';
  let lcpTime = 0;

  const lcpObserver = new PerformanceObserver(entryList => {
    for (const entry of entryList.getEntries()) {
      lcpValue = Math.round(entry.startTime);
      lcpTime = Math.round(entry.startTime);
      if (entry.element) {
        const tag = entry.element.tagName?.toLowerCase() || 'unknown';
        const id = entry.element.id ? `#${entry.element.id}` : '';
        lcpElement = `${tag}${id}`;
      }
    }
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // browser unsupported
  }

  let clsValue = 0;
  const clsObserver = new PerformanceObserver(entryList => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // browser unsupported
  }

  let inpValue = 0;
  let inpTarget = '';
  const inpObserver = new PerformanceObserver(entryList => {
    for (const entry of entryList.getEntries()) {
      if (entry.duration > inpValue) {
        inpValue = Math.round(entry.duration);
        if (entry.target) {
          const tag = entry.target.tagName?.toLowerCase() || 'unknown';
          const id = entry.target.id ? `#${entry.target.id}` : '';
          inpTarget = `${tag}${id}`;
        }
      }
    }
  });

  try {
    inpObserver.observe({
      type: 'event',
      buffered: true,
      durationThreshold: 40,
    });
  } catch {
    // browser unsupported
  }

  const reportFinal = () => {
    enqueue({
      id: `${metricIdPrefix}-lcp`,
      name: 'LCP',
      value: lcpValue,
      rating: lcpRating(lcpValue),
      navigationType,
      path: `${location.pathname}${location.search}`,
      ts: Date.now(),
      meta: {
        lcpTime,
        lcpElement,
      },
    });

    enqueue({
      id: `${metricIdPrefix}-cls`,
      name: 'CLS',
      value: Number(clsValue.toFixed(4)),
      rating: clsRating(clsValue),
      navigationType,
      path: `${location.pathname}${location.search}`,
      ts: Date.now(),
    });

    if (inpValue > 0) {
      enqueue({
        id: `${metricIdPrefix}-inp`,
        name: 'INP',
        value: inpValue,
        rating: inpRating(inpValue),
        navigationType,
        path: `${location.pathname}${location.search}`,
        ts: Date.now(),
        meta: {
          target: inpTarget,
        },
      });
    }

    flush();
  };

  const onHidden = () => {
    if (document.visibilityState === 'hidden') {
      reportFinal();
    }
  };

  document.addEventListener('visibilitychange', onHidden, { capture: true });
  window.addEventListener('pagehide', reportFinal, { capture: true });
}
