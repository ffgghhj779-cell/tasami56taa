"""
Robust screenshot / letterbox cleanup for catalog photos.
Removes black bars even when they contain tiny UI icons.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "public" / "catalog"
CATALOG_TS = ROOT / "src" / "data" / "catalog.ts"
DARK = 36
CONTENT_MIN = 0.04  # row/col must have >=4% non-dark pixels to count as content
TARGET_LONG = 1400
JPEG_QUALITY = 93


def referenced_images() -> list[Path]:
    text = CATALOG_TS.read_text(encoding="utf-8")
    names = sorted(set(re.findall(r"/catalog/(img-\d+\.jpg)", text)))
    return [CATALOG_DIR / n for n in names if (CATALOG_DIR / n).exists()]


def find_content_bounds(img: Image.Image) -> tuple[int, int, int, int]:
    """Return (left, top, right, bottom) exclusive of empty dark bands."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    px = rgb.load()

    def row_has_content(y: int) -> bool:
        hit = 0
        for x in range(w):
            r, g, b = px[x, y]
            if r > DARK or g > DARK or b > DARK:
                hit += 1
        return (hit / w) >= CONTENT_MIN

    def col_has_content(x: int) -> bool:
        hit = 0
        for y in range(h):
            r, g, b = px[x, y]
            if r > DARK or g > DARK or b > DARK:
                hit += 1
        return (hit / h) >= CONTENT_MIN

    top = 0
    while top < h - 1 and not row_has_content(top):
        top += 1
    bottom = h - 1
    while bottom > top and not row_has_content(bottom):
        bottom -= 1
    left = 0
    while left < w - 1 and not col_has_content(left):
        left += 1
    right = w - 1
    while right > left and not col_has_content(right):
        right -= 1

    # Ignore tiny sticky UI dots: shrink sides that are almost empty after first pass
    # by requiring denser content near edges for portrait screenshots
    def dense_row(y: int, ratio: float = 0.12) -> bool:
        hit = 0
        for x in range(left, right + 1):
            r, g, b = px[x, y]
            if r > DARK or g > DARK or b > DARK:
                hit += 1
        return (hit / max(1, right - left + 1)) >= ratio

    # Walk inward until we hit a denser product band (kills thin icon rows in black)
    while top < bottom and not dense_row(top, 0.08):
        top += 1
    while bottom > top and not dense_row(bottom, 0.08):
        bottom -= 1

    pad = 3
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(w - 1, right + pad)
    bottom = min(h - 1, bottom + pad)
    return left, top, right + 1, bottom + 1


def polish(img: Image.Image) -> Image.Image:
    w, h = img.size
    long_edge = max(w, h)
    if long_edge < 1100:
        scale = TARGET_LONG / long_edge
        img = img.resize(
            (max(1, int(w * scale)), max(1, int(h * scale))),
            Image.Resampling.LANCZOS,
        )
    elif long_edge > 2000:
        scale = 1600 / long_edge
        img = img.resize(
            (max(1, int(w * scale)), max(1, int(h * scale))),
            Image.Resampling.LANCZOS,
        )

    # Soft studio look
    img = ImageEnhance.Contrast(img).enhance(1.12)
    img = ImageEnhance.Color(img).enhance(1.06)
    img = ImageEnhance.Sharpness(img).enhance(1.4)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.4, percent=125, threshold=2))
    return img


def process(path: Path) -> dict:
    with Image.open(path) as im:
        src = ImageOps.exif_transpose(im).convert("RGB")
        before = list(src.size)
        box = find_content_bounds(src)
        cropped = src.crop(box)
        # Guard against over-crop
        if cropped.width < 80 or cropped.height < 80:
            cropped = src
            box = [0, 0, src.width, src.height]
            changed = False
        else:
            changed = box != (0, 0, src.width, src.height)

        out = polish(cropped)
        tmp = path.with_suffix(".fix2.jpg")
        out.save(tmp, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        tmp.replace(path)
        return {
            "file": path.name,
            "before": before,
            "box": list(box),
            "final": [out.width, out.height],
            "changed": changed,
        }


def main() -> None:
    files = referenced_images()
    report = {"processed": 0, "cropped": 0, "items": []}
    for path in files:
        try:
            meta = process(path)
            report["processed"] += 1
            if meta["changed"]:
                report["cropped"] += 1
            report["items"].append(meta)
            flag = "CROP" if meta["changed"] else "ok"
            print(f"{flag} {path.name} {meta['before']} -> {meta['final']}")
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {path.name}: {exc}")
            report.setdefault("failed", []).append({"file": path.name, "error": str(exc)})

    (CATALOG_DIR / "letterbox-report-v2.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps({"processed": report["processed"], "cropped": report["cropped"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
