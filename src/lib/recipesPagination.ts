export const RECIPES_PAGE_SIZE = 12

export function getRecipesTotalPages(
  totalRecipes: number,
  pageSize: number = RECIPES_PAGE_SIZE
): number {
  const safeTotal = Number.isFinite(totalRecipes) && totalRecipes > 0 ? totalRecipes : 0
  const safeSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : RECIPES_PAGE_SIZE
  return Math.max(1, Math.ceil(safeTotal / safeSize))
}

export function getRecipesPagePath(page: number): string {
  if (!Number.isFinite(page) || page <= 1) return '/recettes/'
  return `/recettes/page/${Math.floor(page)}/`
}

export function parsePositivePageParam(raw: string | undefined): number | null {
  if (!raw) return null
  if (!/^\d+$/.test(raw)) return null
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return null
  return parsed
}
