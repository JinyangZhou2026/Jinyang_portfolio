from __future__ import annotations

from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter, Transformation
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "tmp" / "pdfs" / "source"
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT = OUTPUT_DIR / "Interview-Story-Bank-Bilingual.pdf"

PAGE_W = 1008.0  # 14 in
PAGE_H = 432.0   # 6 in; intentionally wide to match the FigJam cards
NAVY = (11 / 255, 16 / 255, 32 / 255)
INK = (20 / 255, 28 / 255, 48 / 255)
MUTED = (91 / 255, 104 / 255, 128 / 255)
BLUE = (65 / 255, 105 / 255, 225 / 255)
PALE_BLUE = (238 / 255, 243 / 255, 255 / 255)
PALE_GOLD = (255 / 255, 247 / 255, 225 / 255)
WHITE = (1, 1, 1)

PAGES = [
    ("02-mind-map.pdf", "Story Bank Router / 故事调用导航"),
    ("03-S01.pdf", "S01 · Engineering Complexity → Customer Clarity / 从工程复杂度到客户清晰理解"),
    ("04-S02.pdf", "S02 · Product-Family Design Under Constraints / 工程约束下的产品家族设计"),
    ("05-S03.pdf", "S03 · International Exhibition Delivery System / 国际展会交付系统"),
    ("06-S04.pdf", "S04 · Melody Adventurer — Insight → Product System / 从用户洞察到产品系统"),
    ("07-S05.pdf", "S05 · Field of Vision — Inclusive Mobility / 包容性出行概念"),
    ("08-S06.pdf", "S06 · FAT Bridge — Engineers ↔ Overseas Customers / 连接工程师与海外客户"),
    ("09-question-forecast.pdf", "Predicted Question Router / 高频问题索引"),
    ("10-practice-protocol.pdf", "Practice Protocol / 练习流程"),
    ("11-gap-tracker.pdf", "Next Stories & Evidence / 待补故事与证据"),
]


def draw_text(c: canvas.Canvas, text: str, x: float, y: float, size: float, color=INK, font="STSong-Light") -> None:
    c.setFillColorRGB(*color)
    c.setFont(font, size)
    c.drawString(x, y, text)


def make_cover() -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=(PAGE_W, PAGE_H))
    c.setFillColorRGB(*NAVY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    c.setFillColorRGB(*BLUE)
    c.roundRect(44, 350, 116, 24, 12, fill=1, stroke=0)
    c.setFillColorRGB(*WHITE)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(102, 358, "SHAREABLE PDF")

    c.setFillColorRGB(*WHITE)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(44, 304, "Interview Story Bank")
    draw_text(c, "个人面试故事库 · Bilingual Edition", 44, 275, 17, (0.78, 0.84, 0.98))
    draw_text(c, "用于 behavioral questions、competency-based questions 与 interview mock", 44, 247, 10.5, (0.63, 0.70, 0.84))

    cards = [
        (44, "1  PREDICT / 预测", "先识别 competency，预测高频问题"),
        (238, "2  RETRIEVE / 调用", "选择 primary story + backup story"),
        (432, "3  DELIVER / 表达", "用 STAR-L 组织 60–90 秒答案"),
    ]
    for x, title, body in cards:
        c.setFillColorRGB(0.09, 0.13, 0.24)
        c.roundRect(x, 142, 176, 70, 10, fill=1, stroke=0)
        draw_text(c, title, x + 14, 184, 10.5, WHITE)
        draw_text(c, body, x + 14, 158, 8.5, (0.70, 0.77, 0.90))

    c.setStrokeColorRGB(0.22, 0.29, 0.46)
    c.line(662, 44, 662, 376)
    draw_text(c, "CONTENTS / 目录", 692, 348, 11, WHITE)
    contents = [
        "02  Router / 调用导航",
        "03–08  S01–S06 Core Stories / 核心故事",
        "09  Question Forecast / 问题预测",
        "10  Practice Protocol / 练习流程",
        "11  Gap Tracker / 缺口追踪",
    ]
    y = 310
    for line in contents:
        draw_text(c, line, 692, y, 9.3, (0.72, 0.79, 0.92))
        y -= 36

    draw_text(c, "STAR-L = Situation · Task · Action · Result · Learning", 44, 66, 8.5, (0.52, 0.61, 0.78))
    draw_text(c, "Source: Story Bank Mind Map (FigJam) · Prepared for interview practice & sharing", 44, 44, 8.2, (0.42, 0.50, 0.66))
    c.showPage()
    c.save()
    return buffer.getvalue()


def make_background(title: str, page_no: int, total: int) -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=(PAGE_W, PAGE_H))
    c.setFillColorRGB(*WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    c.setFillColorRGB(*NAVY)
    c.rect(0, PAGE_H - 34, PAGE_W, 34, fill=1, stroke=0)
    draw_text(c, title, 24, PAGE_H - 23, 9.5, WHITE)
    c.setFillColorRGB(*BLUE)
    c.rect(0, PAGE_H - 36, PAGE_W, 2, fill=1, stroke=0)

    c.setStrokeColorRGB(0.88, 0.90, 0.94)
    c.line(24, 19, PAGE_W - 24, 19)
    draw_text(c, "Interview Story Bank / 个人面试故事库", 24, 7.5, 7.2, MUTED)
    draw_text(c, f"{page_no:02d} / {total:02d}", PAGE_W - 62, 7.5, 7.2, MUTED, "Helvetica")
    c.showPage()
    c.save()
    return buffer.getvalue()


def normalize_source(source: Path, title: str, page_no: int, total: int):
    source_page = PdfReader(str(source)).pages[0]
    output_page = PdfReader(BytesIO(make_background(title, page_no, total))).pages[0]

    source_w = float(source_page.mediabox.width)
    source_h = float(source_page.mediabox.height)
    left = 24.0
    right = 24.0
    bottom = 28.0
    top = 44.0
    available_w = PAGE_W - left - right
    available_h = PAGE_H - bottom - top
    scale = min(available_w / source_w, available_h / source_h)
    tx = left + (available_w - source_w * scale) / 2
    ty = bottom + (available_h - source_h * scale) / 2
    output_page.merge_transformed_page(
        source_page,
        Transformation().scale(scale).translate(tx, ty),
        over=True,
    )
    return output_page


def main() -> None:
    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    missing = [name for name, _ in PAGES if not (SOURCE_DIR / name).exists()]
    if missing:
        raise FileNotFoundError(f"Missing source exports: {missing}")

    writer = PdfWriter()
    cover_page = PdfReader(BytesIO(make_cover())).pages[0]
    writer.add_page(cover_page)
    total = len(PAGES) + 1
    for page_no, (filename, title) in enumerate(PAGES, start=2):
        writer.add_page(normalize_source(SOURCE_DIR / filename, title, page_no, total))
        writer.pages[-1].compress_content_streams()

    writer.add_metadata({
        "/Title": "Interview Story Bank / 个人面试故事库",
        "/Subject": "Bilingual behavioral and competency interview story library",
        "/Author": "Story Bank Mind Map",
        "/Keywords": "story bank, behavioral interview, competency interview, STAR-L",
    })
    with OUTPUT.open("wb") as handle:
        writer.write(handle)
    print(OUTPUT)


if __name__ == "__main__":
    main()
