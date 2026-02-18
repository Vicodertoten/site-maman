const normalizeText = (value = '') =>
  (value ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const difficultyOrder = { facile: 1, moyen: 2, difficile: 3 };

const readFiltersConfig = () => {
  const fallback = { currentFilters: {}, pageSize: 10 };
  const el = document.getElementById('recipe-filters-config');
  if (!el) return fallback;
  try {
    const parsed = JSON.parse(el.textContent || '{}');
    return {
      currentFilters: parsed?.currentFilters || {},
      pageSize: Number(parsed?.pageSize) || 10,
    };
  } catch {
    return fallback;
  }
};

const readJSONData = () => {
  if (Array.isArray(window.recipeIndex)) {
    return window.recipeIndex;
  }
  const el = document.getElementById('recipes-index');
  if (!el) return [];
  try {
    return JSON.parse(el.textContent || '[]');
  } catch (error) {
    console.error("Impossible de lire l'index des recettes", error);
    return [];
  }
};

const mergeById = (base = [], incoming = []) => {
  const map = new Map();
  base.forEach(recipe => {
    if (recipe?.id) map.set(recipe.id, recipe);
  });
  incoming.forEach(recipe => {
    if (recipe?.id) map.set(recipe.id, recipe);
  });
  return Array.from(map.values());
};

function initRecipeFilters() {
  if (window.__recipeFiltersInitialized) return;
  window.__recipeFiltersInitialized = true;

  const config = readFiltersConfig();
  const currentFilters = config.currentFilters || {};
  const pageSize = config.pageSize || 10;

  const filterState = {
    search: currentFilters.search || '',
    category: currentFilters.category
      ? [currentFilters.category].flat().filter(Boolean)
      : [],
    difficulty: currentFilters.difficulty
      ? [currentFilters.difficulty].flat().filter(Boolean)
      : [],
    time: currentFilters.time
      ? [currentFilters.time].flat().filter(Boolean)
      : [],
    budget: currentFilters.budget
      ? [currentFilters.budget].flat().filter(Boolean)
      : [],
    tags: currentFilters.tags || [],
    diet: currentFilters.diet || [],
    season: currentFilters.season || [],
    sort: currentFilters.sort || 'recent',
  };

  const parseURLFilters = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get('search') || '',
      category: params.get('category')
        ? params.get('category').split(',').filter(Boolean)
        : [],
      difficulty: params.get('difficulty')
        ? params.get('difficulty').split(',').filter(Boolean)
        : [],
      time: params.get('time')
        ? params.get('time').split(',').filter(Boolean)
        : [],
      budget: params.get('budget')
        ? params.get('budget').split(',').filter(Boolean)
        : [],
      tags: params.get('tags')
        ? params.get('tags').split(',').filter(Boolean)
        : [],
      diet: params.get('diet')
        ? params.get('diet').split(',').filter(Boolean)
        : [],
      season: params.get('season')
        ? params.get('season').split(',').filter(Boolean)
        : [],
      sort: params.get('sort') || 'recent',
    };
  };

  const buildRecipeIndex = recipes =>
    recipes.map(recipe => {
      const totalTime =
        (recipe.prepTime || 0) +
        (recipe.cookTime || 0) +
        (recipe.restTime || 0);
      const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
      const diet = Array.isArray(recipe.diet) ? recipe.diet : [];
      const season = Array.isArray(recipe.season) ? recipe.season : [];
      const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : [];
      const ingredientNames =
        typeof recipe.ingredientText === 'string'
          ? recipe.ingredientText
          : ingredients
              .map(ing => (typeof ing === 'string' ? ing : ing.name))
              .join(' ');

      return {
        ...recipe,
        totalTime,
        _search: normalizeText(
          [
            recipe.title,
            recipe.description,
            ingredientNames,
            tags.join(' '),
            diet.join(' '),
            season.join(' '),
          ].join(' ')
        ),
        _tags: tags.map(normalizeText),
        _diet: diet.map(normalizeText),
        _season: season.map(normalizeText),
      };
    });

  const applyURLFilters = () => {
    const urlFilters = parseURLFilters();
    Object.assign(filterState, urlFilters);
  };

  const updateURL = () => {
    const params = new URLSearchParams();

    if (filterState.search) params.set('search', filterState.search);
    if (filterState.category.length)
      params.set('category', filterState.category.join(','));
    if (filterState.difficulty.length)
      params.set('difficulty', filterState.difficulty.join(','));
    if (filterState.time.length) params.set('time', filterState.time.join(','));
    if (filterState.budget.length)
      params.set('budget', filterState.budget.join(','));
    if (filterState.tags.length) params.set('tags', filterState.tags.join(','));
    if (filterState.diet.length) params.set('diet', filterState.diet.join(','));
    if (filterState.season.length)
      params.set('season', filterState.season.join(','));
    if (filterState.sort && filterState.sort !== 'recent')
      params.set('sort', filterState.sort);

    const query = params.toString();
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  const sortRecipes = recipes =>
    recipes.sort((a, b) => {
      switch (filterState.sort) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'time':
          return (a.totalTime || 0) - (b.totalTime || 0);
        case 'difficulty':
          return (
            (difficultyOrder[a.difficulty] || 99) -
            (difficultyOrder[b.difficulty] || 99)
          );
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popular':
          return (
            (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) ||
            (b.rating || 0) - (a.rating || 0)
          );
        case 'recent':
        default:
          return (
            new Date(b.publishedAt || 0).getTime() -
            new Date(a.publishedAt || 0).getTime()
          );
      }
    });

  const matchesFilters = recipe => {
    if (filterState.search) {
      const term = normalizeText(filterState.search);
      if (!recipe._search.includes(term)) return false;
    }

    if (filterState.category.length > 0) {
      const selected = filterState.category.map(normalizeText);
      if (!selected.includes(normalizeText(recipe.category))) return false;
    }
    if (filterState.difficulty.length > 0) {
      const selected = filterState.difficulty.map(normalizeText);
      if (!selected.includes(normalizeText(recipe.difficulty))) return false;
    }
    if (filterState.budget.length > 0) {
      const selected = filterState.budget.map(normalizeText);
      if (!selected.includes(normalizeText(recipe.budget))) return false;
    }

    if (filterState.time.length > 0) {
      const total = recipe.totalTime || 0;
      const matchesAny = filterState.time.some(value => {
        switch (value) {
          case '15':
            return total < 15;
          case '30':
            return total >= 15 && total < 30;
          case '60':
            return total >= 30 && total < 60;
          case '120':
            return total >= 60;
          default:
            return true;
        }
      });
      if (!matchesAny) return false;
    }

    if (filterState.tags.length > 0) {
      const selectedTags = filterState.tags.map(normalizeText);
      const hasTag = selectedTags.some(tag => recipe._tags.includes(tag));
      if (!hasTag) return false;
    }

    if (filterState.diet.length > 0) {
      const selected = filterState.diet.map(normalizeText);
      const hasDiet = selected.some(diet => recipe._diet.includes(diet));
      if (!hasDiet) return false;
    }

    if (filterState.season.length > 0) {
      const selected = filterState.season.map(normalizeText);
      const hasSeason = selected.some(season =>
        recipe._season.includes(season)
      );
      if (!hasSeason) return false;
    }

    return true;
  };

  const updateActiveFilters = applyFilters => {
    const container = document.getElementById('active-filters');
    if (!container) return;
    container.innerHTML = '';

    const addChip = (label, onRemove) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className =
        'mv-chip hover:bg-mv-leaf hover:text-mv-cream transition-colors';
      button.textContent = label;
      button.addEventListener('click', onRemove);
      container.appendChild(button);
    };

    const getInputLabel = (selector, value) => {
      const input = Array.from(document.querySelectorAll(selector)).find(
        el => el.value === value
      );
      return input?.dataset?.label || input?.textContent || value;
    };

    if (filterState.search) {
      addChip(`Recherche: ${filterState.search}`, () => {
        filterState.search = '';
        const search = document.getElementById('recipe-search');
        if (search) search.value = '';
        applyFilters();
      });
    }

    const removeArrayValue = (key, value, selector) => {
      filterState[key] = filterState[key].filter(item => item !== value);
      const checkbox = document.querySelector(selector);
      if (checkbox) checkbox.checked = false;
      applyFilters();
    };

    filterState.category.forEach(value => {
      addChip(
        getInputLabel(
          `.filter-checkbox[data-filter="category"][value="${value}"]`,
          value
        ),
        () => {
          removeArrayValue(
            'category',
            value,
            `.filter-checkbox[data-filter="category"][value="${value}"]`
          );
        }
      );
    });

    filterState.difficulty.forEach(value => {
      addChip(
        getInputLabel(
          `.filter-checkbox[data-filter="difficulty"][value="${value}"]`,
          value
        ),
        () => {
          removeArrayValue(
            'difficulty',
            value,
            `.filter-checkbox[data-filter="difficulty"][value="${value}"]`
          );
        }
      );
    });

    filterState.time.forEach(value => {
      addChip(
        getInputLabel(
          `.filter-checkbox[data-filter="time"][value="${value}"]`,
          value
        ),
        () => {
          removeArrayValue(
            'time',
            value,
            `.filter-checkbox[data-filter="time"][value="${value}"]`
          );
        }
      );
    });

    filterState.budget.forEach(value => {
      addChip(
        getInputLabel(
          `.filter-checkbox[data-filter="budget"][value="${value}"]`,
          value
        ),
        () => {
          removeArrayValue(
            'budget',
            value,
            `.filter-checkbox[data-filter="budget"][value="${value}"]`
          );
        }
      );
    });

    filterState.tags.forEach(tag => {
      addChip(`#${tag}`, () => {
        removeArrayValue(
          'tags',
          tag,
          `.filter-checkbox[data-filter="tags"][value="${tag}"]`
        );
      });
    });

    filterState.diet.forEach(diet => {
      addChip(
        getInputLabel(
          `.filter-checkbox[data-filter="diet"][value="${diet}"]`,
          diet
        ),
        () => {
          removeArrayValue(
            'diet',
            diet,
            `.filter-checkbox[data-filter="diet"][value="${diet}"]`
          );
        }
      );
    });

    filterState.season.forEach(season => {
      addChip(
        getInputLabel(
          `.filter-checkbox[data-filter="season"][value="${season}"]`,
          season
        ),
        () => {
          removeArrayValue(
            'season',
            season,
            `.filter-checkbox[data-filter="season"][value="${season}"]`
          );
        }
      );
    });
  };

  const updateClearButton = () => {
    const clearBtn = document.getElementById('clear-filters');
    if (!clearBtn) return;
    const hasFilters = Boolean(
      filterState.search ||
      filterState.category.length ||
      filterState.difficulty.length ||
      filterState.time.length ||
      filterState.budget.length ||
      filterState.tags.length ||
      filterState.diet.length ||
      filterState.season.length
    );
    clearBtn.disabled = !hasFilters;

    const countBadge = document.getElementById('filters-count');
    if (countBadge) {
      const count =
        (filterState.search ? 1 : 0) +
        filterState.category.length +
        filterState.difficulty.length +
        filterState.time.length +
        filterState.budget.length +
        filterState.tags.length +
        filterState.diet.length +
        filterState.season.length;
      countBadge.textContent = count.toString();
    }

    const updateCount = (id, count) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = count ? `${count} sélection` : 'Tous';
    };

    updateCount('category-count', filterState.category.length);
    updateCount('difficulty-count', filterState.difficulty.length);
    updateCount('time-count', filterState.time.length);
    updateCount('budget-count', filterState.budget.length);
    updateCount('tags-count', filterState.tags.length);
    updateCount('diet-count', filterState.diet.length);
    updateCount('season-count', filterState.season.length);
  };

  let recipeIndex = [];
  let cardsById = new Map();
  let grid = null;
  let emptyState = null;
  let loadMoreButton = null;
  let autoLoadSentinel = null;
  let autoLoadObserver = null;
  let autoLoadedSteps = 0;
  let lastTotalRecipes = 0;
  let lastDisplayedRecipes = 0;
  let autoLoadInProgress = false;
  const DEFAULT_PAGE_SIZE =
    Number.isFinite(Number(pageSize)) && Number(pageSize) > 0
      ? Number(pageSize)
      : 10;
  const MAX_AUTO_LOAD_STEPS = 9;
  let visibleRecipesLimit = DEFAULT_PAGE_SIZE;

  const hasActiveFilters = () =>
    Boolean(
      filterState.search ||
      filterState.category.length ||
      filterState.difficulty.length ||
      filterState.time.length ||
      filterState.budget.length ||
      filterState.tags.length ||
      filterState.diet.length ||
      filterState.season.length
    );

  const ensureCardForRecipe = (recipe, index = 0) => {
    const existing = cardsById.get(recipe.id);
    if (existing) return existing;
    if (!grid || typeof window.renderRecipeCard !== 'function') return null;

    const wrapper = document.createElement('div');
    wrapper.className = `scroll-fade-in ${index % 2 === 0 ? 'scroll-slide-in-left' : 'scroll-slide-in-right'}`;
    wrapper.style.animationDelay = `${Math.min(index, 18) * 0.05}s`;
    wrapper.dataset.recipeCard = '';
    wrapper.dataset.recipeId = recipe.id;
    wrapper.innerHTML = window.renderRecipeCard(recipe);
    grid.appendChild(wrapper);
    cardsById.set(recipe.id, wrapper);
    return wrapper;
  };

  const updateLoadMoreButton = (totalRecipes, displayedRecipes) => {
    lastTotalRecipes = totalRecipes;
    lastDisplayedRecipes = displayedRecipes;
    if (!loadMoreButton) return;
    const showPagination = !hasActiveFilters();
    const hasMore = displayedRecipes < totalRecipes;

    loadMoreButton.classList.toggle('hidden', !hasMore);
    loadMoreButton.disabled = !hasMore;
    loadMoreButton.textContent = hasMore
      ? `Charger plus (${displayedRecipes}/${totalRecipes})`
      : 'Tout est chargé';

    if (autoLoadSentinel) {
      const canAutoLoad =
        showPagination && hasMore && autoLoadedSteps < MAX_AUTO_LOAD_STEPS;
      autoLoadSentinel.classList.toggle('hidden', !canAutoLoad);
    }
  };

  const loadMorePage = (source = 'manual') => {
    visibleRecipesLimit += DEFAULT_PAGE_SIZE;
    if (source === 'auto') autoLoadedSteps += 1;
    applyFilters();
  };

  const renderCards = recipes => {
    if (!grid) return;
    const shouldPaginate = !hasActiveFilters();
    const displayedRecipes = shouldPaginate
      ? recipes.slice(0, visibleRecipesLimit)
      : recipes;
    const fragment = document.createDocumentFragment();
    const visibleIds = new Set();

    displayedRecipes.forEach((recipe, index) => {
      const card = ensureCardForRecipe(recipe, index);
      if (!card) return;
      visibleIds.add(recipe.id);
      card.classList.remove('hidden');
      fragment.appendChild(card);
    });

    cardsById.forEach((card, id) => {
      if (!visibleIds.has(id)) {
        card.classList.add('hidden');
      }
    });

    grid.appendChild(fragment);

    if (emptyState) {
      emptyState.classList.toggle('hidden', displayedRecipes.length !== 0);
    }

    updateLoadMoreButton(recipes.length, displayedRecipes.length);
  };

  const updateResultsCount = count => {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) resultsCount.textContent = count.toString();
  };

  const applyFilters = () => {
    const filtered = recipeIndex.filter(matchesFilters);
    const sorted = sortRecipes(filtered);

    updateResultsCount(sorted.length);
    updateActiveFilters(applyFilters);
    updateClearButton();
    updateURL();
    renderCards(sorted);

    window.dispatchEvent(
      new CustomEvent('recipesFiltered', {
        detail: { recipes: sorted, filters: { ...filterState } },
      })
    );
  };

  const bindEvents = () => {
    const searchInput = document.getElementById('recipe-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const sortSelect = document.getElementById('sort-filter');
    const filtersPanel = document.getElementById('filters-panel');
    const filtersAdvanced = document.getElementById('filters-advanced');
    const filtersToggle = document.getElementById('filters-toggle');
    loadMoreButton = document.getElementById('recipes-load-more');
    autoLoadSentinel = document.getElementById('recipes-auto-load-sentinel');

    if (!searchInput || !clearSearchBtn || !sortSelect) return;

    const resetPagination = () => {
      visibleRecipesLimit = DEFAULT_PAGE_SIZE;
      autoLoadedSteps = 0;
    };

    const closeAllMenus = () => {
      document
        .querySelectorAll('.filter-menu')
        .forEach(panel => panel.classList.add('hidden'));
      document
        .querySelectorAll('.filter-trigger')
        .forEach(button => button.setAttribute('aria-expanded', 'false'));
    };

    const openMenu = dropdown => {
      if (!dropdown) return;
      const trigger = dropdown.querySelector('.filter-trigger');
      const menu = dropdown.querySelector('.filter-menu');
      if (!trigger || !menu) return;
      closeAllMenus();
      menu.classList.remove('hidden');
      trigger.setAttribute('aria-expanded', 'true');
      const firstInput = menu.querySelector('input');
      if (firstInput && typeof firstInput.focus === 'function')
        firstInput.focus();
    };

    const debounce = (fn, delay = 300) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };

    searchInput.addEventListener(
      'input',
      debounce(() => {
        filterState.search = searchInput.value.trim();
        clearSearchBtn.classList.toggle('hidden', !filterState.search);
        resetPagination();
        applyFilters();
      })
    );

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterState.search = '';
      clearSearchBtn.classList.add('hidden');
      resetPagination();
      applyFilters();
    });

    sortSelect.addEventListener('change', () => {
      filterState.sort = sortSelect.value;
      resetPagination();
      applyFilters();
    });

    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const key = checkbox.dataset.filter;
        if (!key || !filterState[key]) return;
        const checkedValues = Array.from(
          document.querySelectorAll(`.filter-checkbox[data-filter="${key}"]`)
        )
          .filter(input => input.checked)
          .map(input => input.value);
        filterState[key] = checkedValues;
        resetPagination();
        applyFilters();
      });
    });

    document.querySelectorAll('.filter-trigger').forEach(trigger => {
      trigger.addEventListener('click', event => {
        event.preventDefault();
        const dropdown = trigger.closest('.filter-dropdown');
        if (!dropdown) return;
        const menu = dropdown.querySelector('.filter-menu');
        if (!menu) return;
        const isOpen = !menu.classList.contains('hidden');
        if (isOpen) closeAllMenus();
        else openMenu(dropdown);
      });

      trigger.addEventListener('keydown', event => {
        const dropdown = trigger.closest('.filter-dropdown');
        if (!dropdown) return;
        if (
          event.key === 'ArrowDown' ||
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          openMenu(dropdown);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closeAllMenus();
          trigger.focus();
        }
      });
    });

    document.querySelectorAll('.filter-menu').forEach(menu => {
      menu.addEventListener('keydown', event => {
        const inputs = Array.from(menu.querySelectorAll('input'));
        if (!inputs.length) return;
        const activeIndex = inputs.indexOf(document.activeElement);

        if (event.key === 'Escape') {
          event.preventDefault();
          closeAllMenus();
          const dropdown = menu.closest('.filter-dropdown');
          const trigger = dropdown?.querySelector('.filter-trigger');
          if (trigger && typeof trigger.focus === 'function') trigger.focus();
          return;
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const next = inputs[(activeIndex + 1) % inputs.length];
          if (next) next.focus();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          const prev =
            inputs[(activeIndex - 1 + inputs.length) % inputs.length];
          if (prev) prev.focus();
        }
      });
    });

    document.addEventListener('click', event => {
      const target = event.target;
      if (target.closest('.filter-dropdown')) return;
      closeAllMenus();
    });

    if (filtersToggle && filtersPanel && filtersAdvanced) {
      filtersToggle.addEventListener('click', () => {
        const isHidden = filtersPanel.classList.contains('hidden');
        filtersPanel.classList.toggle('hidden', !isHidden);
        filtersAdvanced.classList.toggle('hidden', !isHidden);
        filtersToggle.setAttribute(
          'aria-expanded',
          isHidden ? 'true' : 'false'
        );
      });
    }

    const clearFiltersButton = document.getElementById('clear-filters');
    if (clearFiltersButton) {
      clearFiltersButton.addEventListener('click', () => {
        filterState.search = '';
        filterState.category = [];
        filterState.difficulty = [];
        filterState.time = [];
        filterState.budget = [];
        filterState.tags = [];
        filterState.diet = [];
        filterState.season = [];
        filterState.sort = 'recent';
        resetPagination();

        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        sortSelect.value = 'recent';
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
          checkbox.checked = false;
        });

        applyFilters();
      });
    }

    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', () => {
        loadMorePage('manual');
      });
    }

    if (autoLoadSentinel && typeof IntersectionObserver !== 'undefined') {
      autoLoadObserver = new IntersectionObserver(
        entries => {
          const [entry] = entries;
          if (!entry?.isIntersecting) return;
          if (autoLoadInProgress) return;
          const hasMore = lastDisplayedRecipes < lastTotalRecipes;
          const canAutoLoad =
            !hasActiveFilters() &&
            hasMore &&
            autoLoadedSteps < MAX_AUTO_LOAD_STEPS;
          if (!canAutoLoad) return;

          autoLoadInProgress = true;
          loadMorePage('auto');
          window.requestAnimationFrame(() => {
            autoLoadInProgress = false;
          });
        },
        {
          root: null,
          rootMargin: '240px 0px',
          threshold: 0,
        }
      );

      autoLoadObserver.observe(autoLoadSentinel);
    }
  };

  const syncUI = () => {
    const search = document.getElementById('recipe-search');
    const clear = document.getElementById('clear-search');
    const sort = document.getElementById('sort-filter');
    if (search) search.value = filterState.search || '';
    if (clear) clear.classList.toggle('hidden', !filterState.search);
    if (sort) sort.value = filterState.sort || 'recent';
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
      const key = checkbox.dataset.filter;
      if (!key || !filterState[key]) return;
      checkbox.checked = filterState[key].includes(checkbox.value);
    });
  };

  const fetchPublicIndex = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (!response.ok) return;
      const payload = await response.json();
      if (!Array.isArray(payload?.recipes)) return;

      window.recipeIndex = mergeById(window.recipeIndex || [], payload.recipes);
      recipeIndex = buildRecipeIndex(window.recipeIndex);
      applyFilters();
    } catch (error) {
      console.error("Impossible de charger l'index recettes", error);
    }
  };

  window.addEventListener('recipesIndexUpdated', event => {
    const updated = event?.detail?.recipes;
    if (!Array.isArray(updated)) return;
    window.recipeIndex = mergeById(window.recipeIndex || [], updated);
    recipeIndex = buildRecipeIndex(window.recipeIndex);
    const cards = document.querySelectorAll('[data-recipe-card]');
    cardsById = new Map(
      Array.from(cards).map(card => [card.dataset.recipeId, card])
    );
    applyFilters();
  });

  window.addEventListener('recipesRendererReady', () => {
    applyFilters();
  });

  const sanitizeFilters = () => {
    const checkboxValues = key =>
      new Set(
        Array.from(
          document.querySelectorAll(`.filter-checkbox[data-filter="${key}"]`)
        )
          .map(input => input.value)
          .filter(Boolean)
      );

    const categoryValues = checkboxValues('category');
    const difficultyValues = checkboxValues('difficulty');
    const timeValues = checkboxValues('time');
    const budgetValues = checkboxValues('budget');
    const tagValues = checkboxValues('tags');
    const dietValues = checkboxValues('diet');
    const seasonValues = checkboxValues('season');
    const sortValues = new Set([
      'recent',
      'popular',
      'rating',
      'time',
      'difficulty',
      'name',
    ]);

    filterState.category = filterState.category.filter(value =>
      categoryValues.has(value)
    );
    filterState.difficulty = filterState.difficulty.filter(value =>
      difficultyValues.has(value)
    );
    filterState.time = filterState.time.filter(value => timeValues.has(value));
    filterState.budget = filterState.budget.filter(value =>
      budgetValues.has(value)
    );
    if (filterState.sort && !sortValues.has(filterState.sort))
      filterState.sort = 'recent';

    filterState.tags = filterState.tags.filter(tag => tagValues.has(tag));
    filterState.diet = filterState.diet.filter(diet => dietValues.has(diet));
    filterState.season = filterState.season.filter(season =>
      seasonValues.has(season)
    );
  };

  applyURLFilters();

  window.recipeIndex = Array.isArray(window.recipeIndex)
    ? window.recipeIndex
    : readJSONData();
  recipeIndex = buildRecipeIndex(window.recipeIndex || []);
  grid = document.getElementById('recipes-grid');
  emptyState = document.getElementById('recipes-empty');

  const cards = document.querySelectorAll('[data-recipe-card]');
  cardsById = new Map(
    Array.from(cards).map(card => [card.dataset.recipeId, card])
  );

  sanitizeFilters();
  syncUI();
  bindEvents();
  applyFilters();
  fetchPublicIndex();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRecipeFilters, {
    once: true,
  });
} else {
  initRecipeFilters();
}

export { initRecipeFilters };
