from pathlib import Path

from pypdf import PdfReader, PdfWriter, Transformation
from pypdf._page import PageObject
from pypdf.generic import ArrayObject, NumberObject, RectangleObject


A4_WIDTH = 595.2756
A4_HEIGHT = 841.8898

ROOT = Path("/Users/shots/Documents/Codex/2026-06-08/i-want-to-build-a-personal")
OUTPUT_DIR = ROOT / "output" / "pdf"

FILES = {
    Path("/Users/shots/Downloads/CV_JinyangZhou_17Ago_en.pdf"): OUTPUT_DIR
    / "CV_JinyangZhou_EN.pdf",
    Path("/Users/shots/Downloads/CV_JinyangZhou_17Ago_IT.pdf"): OUTPUT_DIR
    / "CV_JinyangZhou_IT.pdf",
}


def convert_to_a4(source: Path, destination: Path) -> None:
    reader = PdfReader(source)
    writer = PdfWriter()

    for source_page in reader.pages:
        source_width = float(source_page.mediabox.width)
        source_height = float(source_page.mediabox.height)
        scale_x = A4_WIDTH / source_width
        scale_y = A4_HEIGHT / source_height

        a4_page = PageObject.create_blank_page(
            width=A4_WIDTH,
            height=A4_HEIGHT,
        )
        a4_page.merge_transformed_page(
            source_page,
            Transformation().scale(scale_x, scale_y),
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
                    float(rectangle[0]) * scale_x,
                    float(rectangle[1]) * scale_y,
                    float(rectangle[2]) * scale_x,
                    float(rectangle[3]) * scale_y,
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
    for source_path, output_path in FILES.items():
        convert_to_a4(source_path, output_path)
        print(output_path)
