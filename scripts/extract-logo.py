"""
One-shot helper: takes the CovalenStudios logo JPG (black ink on cream bg),
extracts a clean transparent PNG, and writes it to /public.

- Maps luminance to alpha so cream bg → fully transparent, black ink → fully
  opaque, edge anti-aliasing preserved via mid-alpha values.
- Crops away the surrounding negative space.
- Forces the foreground to pure ink black so it composes cleanly on any bg.
"""
from PIL import Image
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(r"C:\Users\Amr\Downloads\WhatsApp Image 2026-05-11 at 1.59.40 PM.jpeg")
DST = ROOT / "public" / "covalen-logo.png"

LO, HI = 8, 235  # luminance → alpha stretch points

def main():
    if not SRC.exists():
        print(f"source missing: {SRC}")
        sys.exit(1)

    src = Image.open(SRC).convert("L")

    def to_alpha(v: int) -> int:
        if v <= LO:
            return 255
        if v >= HI:
            return 0
        return int(round(255 * (HI - v) / (HI - LO)))

    alpha = src.point(to_alpha)

    rgba = Image.new("RGBA", src.size, (5, 5, 5, 255))
    rgba.putalpha(alpha)

    bbox = rgba.getbbox()
    if bbox:
        pad = 24
        x0, y0, x1, y1 = bbox
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(rgba.width, x1 + pad)
        y1 = min(rgba.height, y1 + pad)
        rgba = rgba.crop((x0, y0, x1, y1))

    max_w = 1400
    if rgba.width > max_w:
        ratio = max_w / rgba.width
        new = (max_w, int(rgba.height * ratio))
        rgba = rgba.resize(new, Image.LANCZOS)

    DST.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(DST, "PNG", optimize=True)
    print(f"wrote {DST} ({rgba.width}x{rgba.height})")

if __name__ == "__main__":
    main()
