import { trapFocus } from '../lib/focus-trap.js';

const escapeHtml = (value = '') =>
  value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');

const formatTime = minutes => {
  const numeric = Number(minutes);
  if (!Number.isFinite(numeric) || numeric <= 0) return '';
  const rounded = Math.round(numeric);
  if (rounded < 60) return `${rounded} min`;
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;
  return mins > 0
    ? `${hours}h ${mins.toString().padStart(2, '0')} min`
    : `${hours}h`;
};

const getTotalTime = (prep, cook, rest) => {
  const total = (prep || 0) + (cook || 0) + (rest || 0);
  return total > 0 ? total : null;
};

const getDifficultyColor = difficulty => {
  switch (difficulty) {
    case 'facile':
      return 'text-mv-leaf bg-mv-leaf-20 border border-mv-leaf-30';
    case 'moyen':
      return 'text-mv-coral bg-mv-coral-20 border border-mv-coral-30';
    case 'difficile':
      return 'text-mv-coral bg-mv-coral-30 border border-mv-coral-50';
    default:
      return 'text-mv-forest bg-mv-cream border border-mv-leaf-30';
  }
};

const getDifficultyIcon = difficulty => {
  switch (difficulty) {
    case 'facile':
      return '🟢';
    case 'moyen':
      return '🟡';
    case 'difficile':
      return '🔴';
    default:
      return '⚪';
  }
};

const renderRecipeCard = recipe => {
  const totalTime = getTotalTime(
    recipe.prepTime,
    recipe.cookTime,
    recipe.restTime
  );
  const imageAlt = recipe.imageAlt || recipe.title;
  const imageHtml = recipe.image
    ? `<img src="${escapeHtml(recipe.image)}" alt="${escapeHtml(imageAlt)}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" width="400" height="300" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />`
    : `<div class="w-full h-48 bg-gradient-to-br from-mv-cream to-mv-leaf flex items-center justify-center"><svg class="w-12 h-12 text-mv-forest opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`;

  const badges = [
    recipe.isNew
      ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-mv-coral text-mv-cream animate-pulse">Nouveau</span>`
      : '',
    recipe.isPopular
      ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-mv-plum text-mv-cream"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>Populaire</span>`
      : '',
  ]
    .filter(Boolean)
    .join('');

  const categoryHtml = recipe.category
    ? `<span class="text-xs font-medium text-mv-forest bg-mv-cream px-2 py-1 rounded-full ml-2 flex-shrink-0">${escapeHtml(recipe.category)}</span>`
    : '';

  const descriptionHtml = recipe.description
    ? `<p class="text-sm text-mv-forest-80 line-clamp-2">${escapeHtml(recipe.description)}</p>`
    : '';

  const timeHtml = totalTime
    ? `<div class="flex items-center text-mv-forest-70"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>${formatTime(totalTime)}</div>`
    : '';

  const servingsHtml = recipe.servings
    ? `<div class="flex items-center text-mv-forest-70"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>${escapeHtml(recipe.servings)} pers.</div>`
    : '';

  const difficultyHtml = recipe.difficulty
    ? `<div class="flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}"><span class="mr-1">${getDifficultyIcon(recipe.difficulty)}</span>${escapeHtml(recipe.difficulty)}</div>`
    : '';

  return `<article class="enhanced-recipe-card group relative mv-card hover:border-mv-leaf transition-all duration-300 overflow-hidden p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-leaf focus-visible:ring-offset-2" data-recipe-id="${escapeHtml(recipe.id)}" data-recipe-slug="${escapeHtml(recipe.slug || recipe.id)}" data-recipe-title="${escapeHtml(recipe.title)}" data-recipe-category="${escapeHtml(recipe.categoryValue || recipe.category || '')}" data-recipe-difficulty="${escapeHtml(recipe.difficulty || '')}"><a href="/recette/${encodeURIComponent(recipe.slug || recipe.id)}" class="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-leaf focus-visible:ring-offset-2" aria-label="Voir la recette ${escapeHtml(recipe.title)}"><span class="sr-only">Voir la recette ${escapeHtml(recipe.title)}</span></a><div class="absolute top-3 left-3 z-20 flex gap-2 pointer-events-none">${badges}</div><div class="absolute top-3 right-3 z-20 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"><button class="favorite-btn w-8 h-8 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center hover:scale-110" data-recipe-id="${escapeHtml(recipe.id)}" data-recipe-title="${escapeHtml(recipe.title)}" aria-label="Ajouter aux favoris"><svg class="favorite-icon w-4 h-4 text-mv-forest-60 hover:text-mv-coral transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg><span class="favorite-text sr-only">Ajouter aux favoris</span></button><button class="shopping-btn w-8 h-8 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center hover:scale-110" data-recipe-id="${escapeHtml(recipe.id)}" data-recipe-title="${escapeHtml(recipe.title)}" aria-label="Ajouter à la liste de courses"><svg class="w-4 h-4 text-mv-forest-60 hover:text-mv-leaf transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></button></div><div class="relative z-20 overflow-hidden rounded-lg mb-4 pointer-events-none">${imageHtml}<div class="image-loading-overlay absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center opacity-0 transition-opacity duration-300"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-mv-leaf"></div></div></div><div class="relative z-20 space-y-3 pointer-events-none"><div><div class="flex items-start justify-between mb-1"><h3 class="text-lg font-semibold text-mv-forest group-hover:text-mv-leaf transition-colors duration-200 line-clamp-2">${escapeHtml(recipe.title)}</h3>${categoryHtml}</div>${descriptionHtml}</div><div class="flex items-center justify-between text-sm"><div class="flex items-center space-x-4">${timeHtml}${servingsHtml}${difficultyHtml}</div></div></div><div class="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-mv-leaf group-hover:border-opacity-20 transition-all duration-300 pointer-events-none"></div></article>`;
};

const mergeRecipes = (base = [], incoming = []) => {
  const map = new Map();
  base.forEach(recipe => map.set(recipe.id, recipe));
  incoming.forEach(recipe => map.set(recipe.id, recipe));
  return Array.from(map.values());
};

const updatePackAccess = (packIds = []) => {
  if (!Array.isArray(packIds)) return;
  document.querySelectorAll('[data-pack-card]').forEach(card => {
    const packId = card.dataset.packId;
    const buyBtn = card.querySelector('.buy-pack-btn');
    const downloadBtn = card.querySelector('.download-pack-btn');
    const statusBadge = card.querySelector('[data-pack-status]');
    const hasAccess = packIds.includes(packId);
    if (hasAccess) {
      if (buyBtn) buyBtn.classList.add('hidden');
      if (buyBtn) buyBtn.style.display = 'none';
      if (buyBtn) buyBtn.setAttribute('disabled', 'true');
      if (buyBtn && buyBtn.dataset.defaultLabel)
        buyBtn.textContent = buyBtn.dataset.defaultLabel;
      if (downloadBtn) downloadBtn.classList.remove('hidden');
      if (downloadBtn) downloadBtn.style.display = '';
      if (statusBadge) statusBadge.classList.remove('hidden');
      card.classList.add('bg-mv-cream-50');
    } else {
      if (buyBtn) buyBtn.classList.remove('hidden');
      if (buyBtn) buyBtn.style.display = '';
      if (buyBtn) buyBtn.removeAttribute('disabled');
      if (buyBtn && buyBtn.dataset.defaultLabel)
        buyBtn.textContent = buyBtn.dataset.defaultLabel;
      if (downloadBtn) downloadBtn.classList.add('hidden');
      if (downloadBtn) downloadBtn.style.display = 'none';
      if (statusBadge) statusBadge.classList.add('hidden');
      card.classList.remove('bg-mv-cream-50');
    }
  });
};

const premiumRecipeIds = new Set();
let premiumLoaded = false;

const loadPremiumRecipes = async () => {
  const grid = document.getElementById('recipes-grid');
  if (!grid) return;
  const shopStatus = document.getElementById('shop-status');
  const showShopStatus = message => {
    if (!shopStatus) return;
    shopStatus.textContent = message;
    shopStatus.classList.remove('hidden');
  };
  try {
    const response = await fetch('/api/recipes/premium');
    if (!response.ok) {
      showShopStatus(
        'Accès premium indisponible pour le moment. Réessaie plus tard.'
      );
      return;
    }
    const data = await response.json();

    if (Array.isArray(data.recipes) && data.recipes.length) {
      if (grid.classList.contains('hidden')) {
        grid.classList.remove('hidden');
      }
      const fragment = document.createDocumentFragment();
      data.recipes.forEach(recipe => {
        if (premiumRecipeIds.has(recipe.id)) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'scroll-fade-in';
        wrapper.dataset.recipeCard = '';
        wrapper.dataset.recipeId = recipe.id;
        wrapper.innerHTML = renderRecipeCard(recipe);
        fragment.appendChild(wrapper);
        premiumRecipeIds.add(recipe.id);
      });
      grid.appendChild(fragment);
    }

    const mergedIndex = mergeRecipes(
      window.recipeIndex || [],
      data.index || []
    );
    window.dispatchEvent(
      new CustomEvent('recipesIndexUpdated', {
        detail: { recipes: mergedIndex },
      })
    );
    updatePackAccess(data.packIds || []);
  } catch (error) {
    console.error('Erreur lors du chargement premium', error);
    showShopStatus(
      'Accès premium indisponible pour le moment. Réessaie plus tard.'
    );
  }
};

const ensurePremiumRecipesLoaded = async () => {
  if (premiumLoaded) return;
  await loadPremiumRecipes();
  premiumLoaded = true;
};

const initShopActions = () => {
  const modal = document.getElementById('shop-modal');
  const modalPanel = modal?.querySelector('[data-modal-panel]');
  const modalFocus = modal?.querySelector('[data-modal-focus]');
  const openShopLinks = document.querySelectorAll('[data-open-shop]');
  const shopStatus = document.getElementById('shop-status');
  let lastFocusedElement = null;
  let releaseTrap = null;
  const setShopStatus = message => {
    if (!shopStatus) return;
    shopStatus.textContent = message;
    shopStatus.classList.remove('hidden');
  };
  const clearShopStatus = () => {
    if (!shopStatus) return;
    shopStatus.textContent = '';
    shopStatus.classList.add('hidden');
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    clearShopStatus();
    document.body.style.overflow = '';
    if (releaseTrap) {
      try {
        releaseTrap();
      } catch {
        /* ignore trap teardown issues */
      }
      releaseTrap = null;
    }
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };
  const openModal = () => {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusTarget = modalFocus || modalPanel || modal;
    try {
      releaseTrap = trapFocus(modal, {
        initialFocus: (modalFocus || modalPanel) ?? null,
        returnFocusTo: lastFocusedElement,
        onClose: closeModal,
      });
    } catch {
      if (focusTarget && typeof focusTarget.focus === 'function')
        focusTarget.focus();
    }
    ensurePremiumRecipesLoaded();
  };
  openShopLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault?.();
      openModal();
    });
  });
  if (modal) {
    modal.querySelectorAll('[data-modal-close]').forEach(button => {
      button.addEventListener('click', closeModal);
    });
    modal.addEventListener('click', event => {
      if (event.target && event.target.matches('[data-modal-close]')) {
        closeModal();
      }
    });
  }
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.buy-pack-btn').forEach(button => {
    button.addEventListener('click', async () => {
      if (button.disabled) return;
      const packId = button.dataset.packId;
      if (!packId) return;
      button.disabled = true;
      const previousLabel = button.dataset.defaultLabel || button.textContent;
      button.textContent = 'Redirection...';
      clearShopStatus();
      try {
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packId }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        setShopStatus(
          'Impossible de démarrer le paiement. Réessaie dans un instant.'
        );
      } catch (error) {
        console.error('Erreur checkout', error);
        setShopStatus(
          'Impossible de démarrer le paiement. Réessaie dans un instant.'
        );
      }
      button.disabled = false;
      button.textContent = previousLabel || 'Acheter';
    });
  });

  document.querySelectorAll('.download-pack-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const packId = button.dataset.packId;
      if (!packId) return;
      button.disabled = true;
      const previousLabel = button.textContent;
      button.textContent = 'Préparation...';
      clearShopStatus();
      try {
        const response = await fetch(
          `/api/download/ebook?packId=${encodeURIComponent(packId)}`
        );
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        setShopStatus(
          'Impossible de générer le lien de téléchargement. Réessaie.'
        );
      } catch (error) {
        console.error('Erreur téléchargement', error);
        setShopStatus(
          'Impossible de générer le lien de téléchargement. Réessaie.'
        );
      }
      button.disabled = false;
      button.textContent = previousLabel;
    });
  });

  const accessForm = document.getElementById('access-form');
  const accessStatus = document.getElementById('access-status');
  if (accessForm) {
    accessForm.addEventListener('submit', async event => {
      event.preventDefault();
      const emailInput = accessForm.querySelector('input[name="email"]');
      const submitButton = accessForm.querySelector('button[type="submit"]');
      const email = emailInput?.value?.trim();
      const honeypot = accessForm
        .querySelector('input[name="website"]')
        ?.value?.trim();
      if (!email) return;
      if (accessStatus) accessStatus.textContent = 'Envoi du lien en cours...';
      if (submitButton) submitButton.setAttribute('disabled', 'true');
      try {
        const response = await fetch('/api/access/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, website: honeypot }),
        });
        if (response.ok) {
          if (accessStatus) {
            accessStatus.textContent =
              'Si un achat existe, un lien sera envoyé rapidement.';
          }
        } else if (accessStatus) {
          accessStatus.textContent =
            'Erreur lors de l’envoi. Réessaie plus tard.';
        }
        if (submitButton) submitButton.removeAttribute('disabled');
      } catch (error) {
        if (accessStatus) {
          accessStatus.textContent =
            'Erreur lors de l’envoi. Réessaie plus tard.';
        }
        console.error('Erreur accès', error);
        if (submitButton) submitButton.removeAttribute('disabled');
      }
    });
  }
};

const initPurchaseStatus = () => {
  const status = document.getElementById('payment-status');
  if (!status) return;
  const url = new URL(window.location.href);
  const payment = url.searchParams.get('paiement');
  if (!payment) return;
  if (payment === 'ok') {
    status.textContent =
      'Paiement confirmé. Vérifiez votre email pour activer l’accès permanent.';
    status.classList.remove('hidden');
  } else if (payment === 'cancel' || payment === 'annule') {
    status.textContent =
      'Paiement annulé. Vous pouvez réessayer à tout moment.';
    status.classList.remove('hidden');
  }
  url.searchParams.delete('paiement');
  window.history.replaceState({}, '', url.toString());
};

export function initRecipesPage() {
  if (window.__recipesPageInitialized) return;
  window.__recipesPageInitialized = true;

  window.renderRecipeCard = renderRecipeCard;
  window.dispatchEvent(new CustomEvent('recipesRendererReady'));

  initShopActions();
  initPurchaseStatus();
  ensurePremiumRecipesLoaded();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRecipesPage, {
    once: true,
  });
} else {
  initRecipesPage();
}
