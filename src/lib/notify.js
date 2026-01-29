export function showToast(message = '', { type = 'info', duration = 3000 } = {}) {
  let container = document.getElementById('mv-toasts');
  if (!container) {
    container = document.createElement('div');
    container.id = 'mv-toasts';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    container.className = 'fixed top-6 right-6 z-60 flex flex-col gap-2 items-end';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `max-w-sm w-full px-4 py-2 rounded-lg shadow-lg text-sm ${type === 'error' ? 'bg-mv-coral text-white' : 'bg-mv-forest text-mv-cream'}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      toast.remove();
      if (container && container.children.length === 0) container.remove();
    }, 250);
  }, duration);
}
