/**
 * Ambient "liquid light" backdrop — soft sunlight bloom on cream paper.
 *
 * Sits at z = -10 behind every section. Orb opacities are intentionally low
 * (~20-30%) so that text never loses contrast against the cream base.
 *
 * The wrapper uses `isolation: isolate` so the bloom can never bleed onto
 * higher stacking contexts, even if a parent forgets a z-index.
 */
export default function NebulaBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden bg-bone-50"
      style={{ zIndex: -10, isolation: "isolate" }}
    >
      {/* Base cream wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-bone-100 via-bone-50 to-bone-100" />

      {/* Warm bloom orbs — kept subtle so ink text never washes out */}
      <div
        className="absolute -top-40 -left-32 h-[40rem] w-[40rem] rounded-full opacity-40 blur-[120px] animate-float-slow"
        style={{
          background:
            "radial-gradient(closest-side, rgba(242,201,168,0.55), rgba(242,201,168,0) 70%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[34rem] w-[34rem] rounded-full opacity-35 blur-[120px] animate-float-slower"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,207,160,0.50), rgba(232,207,160,0) 70%)",
        }}
      />
      <div
        className="absolute bottom-[-14rem] left-1/4 h-[44rem] w-[44rem] rounded-full opacity-30 blur-[140px] animate-float-slow"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,184,160,0.45), rgba(232,184,160,0) 70%)",
        }}
      />
      <div
        className="absolute top-[-10rem] right-1/4 h-[26rem] w-[26rem] rounded-full opacity-35 blur-[100px] animate-float-slower"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,245,224,0.70), rgba(255,245,224,0) 70%)",
        }}
      />

      {/* Soft paper vignette so the bloom never competes with foreground text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(245,241,230,0) 35%, rgba(214,207,182,0.30) 100%)",
        }}
      />

      {/* Very faint paper grain — barely visible, kills bloom flatness */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(5,5,5,1) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
