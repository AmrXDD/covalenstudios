/**
 * Centralised z-index scale. Single source of truth for stacking order —
 * if you need a new layer, add it here so the ordering stays auditable.
 *
 * Tailwind equivalents (used in className):
 *   nebula  -> -z-10
 *   base    -> z-0
 *   raised  -> z-10
 *   sticky  -> z-20
 *   fab     -> z-30
 *   nav     -> z-40
 *   overlay -> z-50
 */
export const Z = {
  nebula: -10,
  base: 0,
  raised: 10,
  sticky: 20,
  fab: 30,
  nav: 40,
  overlay: 50,
} as const;
