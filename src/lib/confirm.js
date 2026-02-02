import { trapFocus } from './focus-trap.js';

export function confirmDialog(message = 'Êtes-vous sûr ?', { title = 'Confirmer', confirmText = 'Oui', cancelText = 'Annuler' } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4';
    overlay.setAttribute('role', 'presentation');

    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-lg shadow-xl max-w-md w-full p-6';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    dialog.innerHTML = `
      <div class="mb-4">
        <h3 class="text-lg font-serif font-bold text-mv-forest mb-2">${title}</h3>
        <p class="text-sm text-mv-forest-70">${message}</p>
      </div>
      <div class="flex justify-end gap-3 mt-4">
        <button class="mv-btn mv-btn-secondary" data-confirm-cancel>${cancelText}</button>
        <button class="mv-btn mv-btn-primary bg-mv-leaf text-mv-cream" data-confirm-ok>${confirmText}</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const cancelBtn = dialog.querySelector('[data-confirm-cancel]');
    const okBtn = dialog.querySelector('[data-confirm-ok]');

    const cleanupTrap = trapFocus(dialog, { initialFocus: okBtn, onClose: () => { cleanup(false); } });

    const cleanup = (result) => {
      cleanupTrap();
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve(result);
    };

    cancelBtn.addEventListener('click', () => cleanup(false));
    okBtn.addEventListener('click', () => cleanup(true));

    // Click outside closes (cancel)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cleanup(false);
    });
  });
}
