"""Enhance catalog product photos: upscale small ones, mild sharpen/contrast, high-quality JPEG."""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "public" / "catalog"
CATALOG_TS = ROOT / "src" / "data" / "catalog.ts"
MIN_EDGE = 900
TARGET_LONG = 1400
JPEG_QUALITY = 92


def referenced_images() -> set[str]:
    text = CATALOG_TS.read_text(encoding="utf-8")
    return set(re.findall(r"/catalog/(img-\d+\.jpg)", text))


def enhance(path: Path) -> bool:
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        im = im.convert("RGB")
        w, h = im.size
        long_edge = max(w, h)

        # Upscale soft photos that are too small for cards
        if long_edge < MIN_EDGE:
            scale = TARGET_LONG / long_edge
            new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
            im = im.resize(new_size, Image.Resampling.LANCZOS)
        elif long_edge > 2200:
            # Cap huge files without losing useful detail
            scale = 1800 / long_edge
            new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
            im = im.resize(new_size, Image.Resampling.LANCZOS)

        # Gentle studio-style polish (avoid overcooking)
        im = ImageEnhance.Contrast(im).enhance(1.08)
        im = ImageEnhance.Color(im).enhance(1.06)
        im = ImageEnhance.Sharpness(im).enhance(1.25)
        im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=3))

        tmp = path.with_suffix(".tmp.jpg")
        im.save(tmp, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        tmp.replace(path)
        return True


def main() -> None:
    refs = referenced_images()
    if not refs:
        # Fallback: all jpgs
        refs = {p.name for p in CATALOG_DIR.glob("img-*.jpg")}

    done = 0
    failed: list[str] = []
    for name in sorted(refs):
        path = CATALOG_DIR / name
        if not path.exists():
            failed.append(name)
            continue
        try:
            enhance(path)
            done += 1
            print(f"OK {name}")
        except Exception as exc:  # noqa: BLE001
            failed.append(f"{name}: {exc}")
            print(f"FAIL {name}: {exc}")

    summary = {"enhanced": done, "failed": failed}
    (CATALOG_DIR / "enhance-report.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
