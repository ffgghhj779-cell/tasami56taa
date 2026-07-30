"""
Auto-crop letterboxed / screenshot product photos:
- remove black (and near-black) bars
- trim thin dark frames
- upscale + polish for card display
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "public" / "catalog"
CATALOG_TS = ROOT / "src" / "data" / "catalog.ts"
DARK_THRESHOLD = 28  # 0-255 mean channel threshold for "black bar"
ROW_DARK_RATIO = 0.92
COL_DARK_RATIO = 0.92
TARGET_LONG = 1400
JPEG_QUALITY = 93


def referenced_images() -> list[Path]:
    text = CATALOG_TS.read_text(encoding="utf-8")
    names = sorted(set(re.findall(r"/catalog/(img-\d+\.jpg)", text)))
    return [CATALOG_DIR / n for n in names if (CATALOG_DIR / n).exists()]


def _is_dark_row(img: Image.Image, y: int) -> bool:
    row = img.crop((0, y, img.width, y + 1))
    # count near-black pixels
    dark = 0
    total = img.width
    for px in row.getdata():
        if max(px) <= DARK_THRESHOLD:
            dark += 1
    return (dark / total) >= ROW_DARK_RATIO


def _is_dark_col(img: Image.Image, x: int) -> bool:
    col = img.crop((x, 0, x + 1, img.height))
    dark = 0
    total = img.height
    for px in col.getdata():
        if max(px) <= DARK_THRESHOLD:
            dark += 1
    return (dark / total) >= COL_DARK_RATIO


def crop_letterbox(img: Image.Image) -> tuple[Image.Image, dict]:
    """Crop contiguous near-black bars from all sides."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    top = 0
    bottom = h - 1
    left = 0
    right = w - 1

    while top < bottom and _is_dark_row(rgb, top):
        top += 1
    while bottom > top and _is_dark_row(rgb, bottom):
        bottom -= 1
    while left < right and _is_dark_col(rgb, left):
        left += 1
    while right > left and _is_dark_col(rgb, right):
        right -= 1

    # safety padding so we don't clip product edges too hard
    pad = 2
    top = max(0, top - pad)
    left = max(0, left - pad)
    bottom = min(h - 1, bottom + pad)
    right = min(w - 1, right + pad)

    cropped = rgb.crop((left, top, right + 1, bottom + 1))
    meta = {
        "before": [w, h],
        "after": [cropped.width, cropped.height],
        "box": [left, top, right + 1, bottom + 1],
        "changed": cropped.size != (w, h),
    }
    return cropped, meta


def content_bbox(img: Image.Image) -> Image.Image | None:
    """Fallback: trim using non-dark content bounding box."""
    rgb = img.convert("RGB")
    gray = rgb.convert("L")
    # Treat very dark as background
    mask = gray.point(lambda p: 255 if p > DARK_THRESHOLD + 8 else 0)
    bbox = mask.getbbox()
    if not bbox:
        return None
    # Expand slightly
    l, t, r, b = bbox
    pad = 4
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(rgb.width, r + pad)
    b = min(rgb.height, b + pad)
    # Ignore tiny crops
    if (r - l) < rgb.width * 0.35 or (b - t) < rgb.height * 0.35:
        return None
    return rgb.crop((l, t, r, b))


def polish(img: Image.Image) -> Image.Image:
    w, h = img.size
    long_edge = max(w, h)
    if long_edge < 1000:
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

    img = ImageEnhance.Contrast(img).enhance(1.1)
    img = ImageEnhance.Color(img).enhance(1.05)
    img = ImageEnhance.Sharpness(img).enhance(1.35)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.3, percent=120, threshold=2))
    return img


def process(path: Path) -> dict:
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        cropped, meta = crop_letterbox(im)

        # If bars were mild / uneven, try content bbox when aspect still extreme
        aw, ah = cropped.size
        aspect = aw / max(ah, 1)
        if aspect < 0.55 or aspect > 1.9:
            alt = content_bbox(cropped)
            if alt is not None and alt.size[0] * alt.size[1] > aw * ah * 0.4:
                cropped = alt
                meta["content_bbox"] = True
                meta["after"] = [cropped.width, cropped.height]

        out = polish(cropped)
        tmp = path.with_suffix(".fix.jpg")
        out.save(tmp, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        tmp.replace(path)
        meta["file"] = path.name
        meta["final"] = [out.width, out.height]
        return meta


def main() -> None:
    files = referenced_images()
    report = {"processed": 0, "cropped": 0, "items": []}
    for path in files:
        try:
            meta = process(path)
            report["processed"] += 1
            if meta.get("changed") or meta.get("content_bbox"):
                report["cropped"] += 1
            report["items"].append(meta)
            flag = "CROP" if meta.get("changed") or meta.get("content_bbox") else "ok"
            print(f"{flag} {path.name} {meta['before']} -> {meta['final']}")
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {path.name}: {exc}")
            report.setdefault("failed", []).append({"file": path.name, "error": str(exc)})

    (CATALOG_DIR / "letterbox-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps({"processed": report["processed"], "cropped": report["cropped"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
