import argparse
from pathlib import Path

from pypdf import PdfReader, PdfWriter, Transformation
from pypdf._page import PageObject
from pypdf.generic import ArrayObject, NumberObject, RectangleObject


A4_WIDTH = 595.2756
A4_HEIGHT = 841.8898

def convert_to_a4(source: Path, destination: Path) -> None:
    """Fit the original vector artwork and URI links to A4 without distortion."""
    if source.resolve() == destination.resolve():
        raise ValueError("Use a separate destination to preserve the original CV.")
    reader = PdfReader(source)
    writer = PdfWriter()

    for source_page in reader.pages:
        if source_page.rotation:
            source_page.transfer_rotation_to_content()
        source_width = float(source_page.mediabox.width)
        source_height = float(source_page.mediabox.height)
        scale = min(A4_WIDTH / source_width, A4_HEIGHT / source_height)
        offset_x = (A4_WIDTH - source_width * scale) / 2 - float(source_page.mediabox.left) * scale
        offset_y = (A4_HEIGHT - source_height * scale) / 2 - float(source_page.mediabox.bottom) * scale

        a4_page = PageObject.create_blank_page(
            width=A4_WIDTH,
            height=A4_HEIGHT,
        )
        a4_page.merge_transformed_page(
            source_page,
            Transformation().scale(scale).translate(offset_x, offset_y),
            expand=False,
        )
        # merge_transformed_page copies the original link rectangles without
        # scaling them. Remove those copies and recreate correctly scaled links.
        a4_page.pop("/Annots", None)
        writer.add_page(a4_page)

        page_number = len(writer.pages) - 1
        for annotation_ref in source_page.get("/Annots", []):
            annotation = annotation_ref.get_object()
            action = annotation.get("/A")
            rectangle = annotation.get("/Rect")
            if not action or action.get("/S") != "/URI" or not rectangle:
                continue
            scaled_rectangle = RectangleObject(
                (
                    float(rectangle[0]) * scale + offset_x,
                    float(rectangle[1]) * scale + offset_y,
                    float(rectangle[2]) * scale + offset_x,
                    float(rectangle[3]) * scale + offset_y,
                )
            )
            writer.add_uri(
                page_number,
                action["/URI"],
                scaled_rectangle,
                border=ArrayObject(
                    [NumberObject(0), NumberObject(0), NumberObject(0)]
                ),
            )

    if reader.metadata:
        metadata = {
            key: value
            for key, value in reader.metadata.items()
            if isinstance(key, str) and isinstance(value, str)
        }
        writer.add_metadata(metadata)

    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("wb") as stream:
        writer.write(stream)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Proportionally resize a CV PDF to A4, preserving URI links.")
    parser.add_argument("source", type=Path, help="Explicit path to the latest source CV")
    parser.add_argument("destination", type=Path, help="Separate A4 output path")
    args = parser.parse_args()
    convert_to_a4(args.source, args.destination)
    print(args.destination)
