#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SITE = 'https://murielcruysmans.com';
const DEFAULT_URLS = [
  '/',
  '/recettes/',
  '/cours-cuisine-wavre/',
  '/privatisation-entreprise-wavre/',
];

const reportArgIndex = process.argv.indexOf('--report');
const reportPath =
  reportArgIndex > -1
    ? process.argv[reportArgIndex + 1]
    : './.reports/cwv-baseline.json';

const site = (process.env.CWV_SITE || DEFAULT_SITE).replace(/\/$/, '');
const urls = (process.env.CWV_URLS || DEFAULT_URLS.join(','))
  .split(',')
  .map(item => item.trim())
  .filter(Boolean)
  .map(item => {
    if (/^https?:\/\//i.test(item)) return item;
    return `${site}${item.startsWith('/') ? '' : '/'}${item}`;
  });

const cruxApiKey =
  process.env.CRUX_API_KEY || process.env.PAGESPEED_API_KEY || '';

if (!cruxApiKey) {
  console.error(
    'CRUX_API_KEY manquant. Ajoute CRUX_API_KEY pour interroger CrUX.'
  );
  process.exit(1);
}

const endpoint = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${encodeURIComponent(cruxApiKey)}`;

function pickMetric(record, key) {
  const metric = record?.metrics?.[key];
  const p75 = metric?.percentiles?.p75;
  return Number.isFinite(p75) ? p75 : null;
}

function classify(name, value) {
  if (!Number.isFinite(value)) return 'unknown';
  if (name === 'LCP') {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }
  if (name === 'INP') {
    if (value <= 200) return 'good';
    if (value <= 500) return 'needs-improvement';
    return 'poor';
  }
  if (name === 'CLS') {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }
  return 'unknown';
}

async function queryCrux(url, formFactor = 'PHONE') {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      formFactor,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      url,
      formFactor,
      ok: false,
      status: res.status,
      error: text.slice(0, 500),
    };
  }

  const json = await res.json();
  const record = json.record || {};

  const lcp = pickMetric(record, 'largest_contentful_paint');
  const inp = pickMetric(record, 'interaction_to_next_paint');
  const cls = pickMetric(record, 'cumulative_layout_shift');

  return {
    url,
    formFactor,
    ok: true,
    lcp,
    inp,
    cls,
    lcpRating: classify('LCP', lcp),
    inpRating: classify('INP', inp),
    clsRating: classify('CLS', cls),
    collectionPeriod: record.collectionPeriod || null,
  };
}

async function run() {
  const results = [];
  for (const url of urls) {
    const result = await queryCrux(url, 'PHONE');
    results.push(result);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    source: 'CrUX API',
    site,
    urls,
    results,
  };

  const absoluteReportPath = path.resolve(reportPath);
  await fs.mkdir(path.dirname(absoluteReportPath), { recursive: true });
  await fs.writeFile(
    absoluteReportPath,
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  console.log('CWV baseline report écrit:', absoluteReportPath);

  for (const item of results) {
    if (!item.ok) {
      console.log(`- ${item.url} => erreur ${item.status}`);
      continue;
    }
    console.log(`- ${item.url}`);
    console.log(`  LCP: ${item.lcp} (${item.lcpRating})`);
    console.log(`  INP: ${item.inp} (${item.inpRating})`);
    console.log(`  CLS: ${item.cls} (${item.clsRating})`);
  }
}

run().catch(error => {
  console.error('Erreur baseline CWV:', error);
  process.exit(1);
});
