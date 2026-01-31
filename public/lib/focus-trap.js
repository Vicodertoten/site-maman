export function trapFocus(container, { initialFocus = null, onClose = null, returnFocusTo = null } = {}) {
  if (!container) return () => {};

  const focusableSelector = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const prevActive = document.activeElement;
  const getFocusable = () => Array.from(container.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null || getComputedStyle(el).visibility !== 'hidden');

  const firstFocusable = initialFocus || getFocusable()[0] || container;

  const keyHandler = (e) => {
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }
    if (e.key === 'Escape') {
      if (typeof onClose === 'function') onClose();
    }
  };

  // Inert / aria-hidden siblings for better screen reader support
  const siblings = Array.from(document.body.children).filter((el) => !container.contains(el) && el !== container);
  const previousAttrs = siblings.map((el) => ({ el, ariaHidden: el.getAttribute('aria-hidden'), inert: el.inert }));
  siblings.forEach((el) => {
    try {
      el.setAttribute('aria-hidden', 'true');
      if ('inert' in el) el.inert = true;
    } catch (e) {
      // ignore
    }
  });

  document.addEventListener('keydown', keyHandler);

  // set initial focus
  try {
    if (firstFocusable && typeof firstFocusable.focus === 'function') firstFocusable.focus();
  } catch (e) {
    // ignore
  }

  return function release() {
    document.removeEventListener('keydown', keyHandler);
    previousAttrs.forEach(({ el, ariaHidden, inert }) => {
      try {
        if (ariaHidden === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', ariaHidden);
        if ('inert' in el) el.inert = inert;
      } catch (e) {
        // ignore
      }
    });
    try {
      if (returnFocusTo && typeof returnFocusTo.focus === 'function') returnFocusTo.focus();
      else if (prevActive && typeof prevActive.focus === 'function') prevActive.focus();
    } catch (e) {}
  };
}
