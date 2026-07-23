from PIL import Image, ImageDraw
from pathlib import Path

assets = Path(
    r"C:\Users\lenovo\.cursor\projects\c-Users-lenovo-Downloads-tasami56taa-main-tasami56taa-main\assets"
)
out = Path(
    r"C:\Users\lenovo\Downloads\tasami56taa-main\tasami56taa-main\public\products"
)
logo_path = Path(
    r"C:\Users\lenovo\Downloads\tasami56taa-main\tasami56taa-main\public\logo-mark.png"
)
out.mkdir(parents=True, exist_ok=True)

mapping = {
    "fries.jpg": "fries.jpg",
    "eggs.jpg": "eggs.jpg",
    "chilled-poultry.jpg": "chilled-poultry-v2.jpg",
    "fresh-poultry.jpg": "fresh-poultry-v2.jpg",
    "chicken-legs.jpg": "chicken-legs-v2.jpg",
    "chicken-breast.jpg": "chicken-breast-v2.jpg",
}

logo = Image.open(logo_path).convert("RGBA")


def brand(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    target_w = 1200
    if w != target_w:
        nh = int(h * target_w / w)
        img = img.resize((target_w, nh), Image.Resampling.LANCZOS)
        w, h = img.size

    badge = int(w * 0.16)
    pad = int(badge * 0.18)
    plate_size = badge + pad * 2
    plate = Image.new("RGBA", (plate_size, plate_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(plate)
    draw.rounded_rectangle(
        (0, 0, plate_size - 1, plate_size - 1),
        radius=int(plate_size * 0.22),
        fill=(255, 255, 255, 230),
        outline=(244, 180, 26, 220),
        width=max(2, plate_size // 40),
    )

    lw, lh = logo.size
    scale = (badge * 0.92) / max(lw, lh)
    logo_r = logo.resize(
        (max(1, int(lw * scale)), max(1, int(lh * scale))),
        Image.Resampling.LANCZOS,
    )
    pixels = logo_r.load()
    for y in range(logo_r.height):
        for x in range(logo_r.width):
            r, g, b, a = pixels[x, y]
            if r < 35 and g < 35 and b < 35:
                pixels[x, y] = (0, 0, 0, 0)

    lx = (plate_size - logo_r.width) // 2
    ly = (plate_size - logo_r.height) // 2
    plate.alpha_composite(logo_r, (lx, ly))

    margin = int(w * 0.035)
    pos = (w - plate_size - margin, h - plate_size - margin)
    img.alpha_composite(plate, pos)
    return img.convert("RGB")


for dest, src in mapping.items():
    src_path = assets / src
    if not src_path.exists():
        print("MISSING", src_path)
        continue
    im = Image.open(src_path)
    branded = brand(im)
    dest_path = out / dest
    branded.save(dest_path, "JPEG", quality=88, optimize=True)
    print(f"OK {dest} <- {src} ({dest_path.stat().st_size // 1024} KB)")

print("done")
