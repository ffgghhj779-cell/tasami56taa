"""
Crop screenshot letterboxing by keeping the largest bright content band.
Ignores tiny UI icons sitting inside black bars.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "public" / "catalog"
CATALOG_TS = ROOT / "src" / "data" / "catalog.ts"
TARGET_LONG = 1400
JPEG_QUALITY = 93


def referenced_images() -> list[Path]:
    text = CATALOG_TS.read_text(encoding="utf-8")
    names = sorted(set(re.findall(r"/catalog/(img-\d+\.jpg)", text)))
    return [CATALOG_DIR / n for n in names if (CATALOG_DIR / n).exists()]


def row_metrics(img: Image.Image) -> list[tuple[float, float]]:
    """Return (mean_luma, bright_ratio) per row. Sampled for speed."""
    w, h = img.size
    px = img.load()
    step = max(1, w // 120)
    out: list[tuple[float, float]] = []
    for y in range(h):
        total = 0.0
        bright = 0
        n = 0
        for x in range(0, w, step):
            r, g, b = px[x, y]
            luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
            total += luma
            if luma > 42:
                bright += 1
            n += 1
        out.append((total / n, bright / n))
    return out


def col_metrics(img: Image.Image, top: int, bottom: int) -> list[tuple[float, float]]:
    w, h = img.size
    px = img.load()
    step = max(1, (bottom - top) // 120)
    out: list[tuple[float, float]] = []
    for x in range(w):
        total = 0.0
        bright = 0
        n = 0
        for y in range(top, bottom, max(1, step)):
            r, g, b = px[x, y]
            luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
            total += luma
            if luma > 42:
                bright += 1
            n += 1
        out.append((total / max(1, n), bright / max(1, n)))
    return out


def largest_run(flags: list[bool]) -> tuple[int, int]:
    best = (0, -1)
    i = 0
    n = len(flags)
    while i < n:
        if not flags[i]:
            i += 1
            continue
        j = i
        while j < n and flags[j]:
            j += 1
        if j - i > best[1] - best[0] + 1:
            best = (i, j - 1)
        i = j
    return best


def content_box(img: Image.Image) -> tuple[int, int, int, int]:
    rows = row_metrics(img)
    # A row is content if reasonably bright overall OR has enough bright pixels.
    # This skips near-black bars that only have a tiny UI speck.
    row_flags = [(m > 28 and br > 0.12) or br > 0.22 or m > 55 for m, br in rows]
    top, bottom = largest_run(row_flags)
    if bottom < top:
        return 0, 0, img.width, img.height

    cols = col_metrics(img, top, bottom + 1)
    col_flags = [(m > 28 and br > 0.12) or br > 0.22 or m > 55 for m, br in cols]
    left, right = largest_run(col_flags)
    if right < left:
        left, right = 0, img.width - 1

    pad = 4
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(img.width - 1, right + pad)
    bottom = min(img.height - 1, bottom + pad)
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
    img = ImageEnhance.Contrast(img).enhance(1.12)
    img = ImageEnhance.Color(img).enhance(1.06)
    img = ImageEnhance.Sharpness(img).enhance(1.45)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.4, percent=130, threshold=2))
    return img


def process(path: Path) -> dict:
    with Image.open(path) as im:
        src = ImageOps.exif_transpose(im).convert("RGB")
        before = list(src.size)
        box = content_box(src)
        cropped = src.crop(box)
        if cropped.width < 60 or cropped.height < 60:
            cropped = src
            box = (0, 0, src.width, src.height)
        changed = box != (0, 0, src.width, src.height)
        # Meaningful crop: at least 6% area removed
        area_ratio = (cropped.width * cropped.height) / (src.width * src.height)
        meaningful = area_ratio < 0.94
        out = polish(cropped if meaningful else src)
        tmp = path.with_suffix(".fix3.jpg")
        out.save(tmp, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        tmp.replace(path)
        return {
            "file": path.name,
            "before": before,
            "box": list(box),
            "final": [out.width, out.height],
            "changed": meaningful,
            "area_ratio": round(area_ratio, 3),
        }


def main() -> None:
    report = {"processed": 0, "cropped": 0, "items": []}
    for path in referenced_images():
        try:
            meta = process(path)
            report["processed"] += 1
            if meta["changed"]:
                report["cropped"] += 1
            report["items"].append(meta)
            flag = "CROP" if meta["changed"] else "ok"
            print(
                f"{flag} {path.name} {meta['before']} -> {meta['final']} area={meta['area_ratio']}"
            )
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {path.name}: {exc}")
            report.setdefault("failed", []).append({"file": path.name, "error": str(exc)})

    (CATALOG_DIR / "letterbox-report-v3.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps({"processed": report["processed"], "cropped": report["cropped"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
