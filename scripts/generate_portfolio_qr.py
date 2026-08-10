#!/usr/bin/env python3
"""Generate print-ready portfolio QR assets."""

from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.graphics.barcode.qr import QrCodeWidget


URL = "https://zhoujinyang.com/"
QUIET_ZONE = 4
PNG_MODULE_SIZE = 32

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ASSET_DIR = PROJECT_ROOT / "assets"
SVG_PATH = ASSET_DIR / "qr-zhoujinyang-portfolio.svg"
PNG_PATH = ASSET_DIR / "qr-zhoujinyang-portfolio.png"


def qr_matrix() -> list[list[bool]]:
    widget = QrCodeWidget(URL, barLevel="H")
    widget.qr.make()
    return widget.qr.modules


def write_svg(matrix: list[list[bool]]) -> None:
    count = len(matrix)
    size = count + QUIET_ZONE * 2
    modules = []

    for row_index, row in enumerate(matrix):
        for column_index, is_dark in enumerate(row):
            if is_dark:
                modules.append(
                    f'<rect x="{column_index + QUIET_ZONE}" '
                    f'y="{row_index + QUIET_ZONE}" width="1" height="1"/>'
                )

    svg = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {size} {size}" role="img" '
        'aria-labelledby="qr-title qr-description" shape-rendering="crispEdges">\n'
        '  <title id="qr-title">Jinyang Zhou portfolio QR code</title>\n'
        f'  <desc id="qr-description">Open {URL}</desc>\n'
        f'  <rect width="{size}" height="{size}" fill="#fff"/>\n'
        '  <g fill="#000">\n    '
        + "\n    ".join(modules)
        + "\n  </g>\n</svg>\n"
    )
    SVG_PATH.write_text(svg, encoding="utf-8")


def write_png(matrix: list[list[bool]]) -> None:
    count = len(matrix)
    size = (count + QUIET_ZONE * 2) * PNG_MODULE_SIZE
    image = Image.new("RGB", (size, size), "white")
    draw = ImageDraw.Draw(image)

    for row_index, row in enumerate(matrix):
        for column_index, is_dark in enumerate(row):
            if not is_dark:
                continue
            left = (column_index + QUIET_ZONE) * PNG_MODULE_SIZE
            top = (row_index + QUIET_ZONE) * PNG_MODULE_SIZE
            draw.rectangle(
                (
                    left,
                    top,
                    left + PNG_MODULE_SIZE - 1,
                    top + PNG_MODULE_SIZE - 1,
                ),
                fill="black",
            )

    image.save(PNG_PATH, format="PNG", optimize=True, dpi=(300, 300))


def main() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    matrix = qr_matrix()
    write_svg(matrix)
    write_png(matrix)
    print(f"Created {SVG_PATH.relative_to(PROJECT_ROOT)}")
    print(f"Created {PNG_PATH.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
