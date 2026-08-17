from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Jinyang_Zhou_ATS_Resume_EN_A4.pdf"


def section(title: str, styles: dict) -> list:
    return [
        Spacer(1, 2.2 * mm),
        Paragraph(title.upper(), styles["section"]),
        Spacer(1, 0.8 * mm),
    ]


def role(title: str, organization: str, location: str, dates: str, bullets: list[str], styles: dict) -> list:
    block = [
        Paragraph(f"<b>{title}</b> | {organization} | {location} | {dates}", styles["role"]),
        Spacer(1, 0.5 * mm),
    ]
    block.extend(Paragraph(f"- {item}", styles["bullet"]) for item in bullets)
    return [KeepTogether(block)]


def build() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm,
        title="Jinyang Zhou - ATS Resume EN",
        author="Jinyang Zhou",
        subject="Product Visualization Designer, Industrial Designer, Technical Communication",
    )

    base = getSampleStyleSheet()
    styles = {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=22,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111111"),
            spaceAfter=2,
        ),
        "headline": ParagraphStyle(
            "Headline",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.7,
            leading=11.5,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#202020"),
            spaceAfter=3,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.8,
            leading=11,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#202020"),
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.2,
            leading=12,
            textColor=colors.HexColor("#111111"),
            borderWidth=0,
            borderColor=colors.HexColor("#888888"),
            borderPadding=0,
            spaceAfter=0,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=11.2,
            textColor=colors.HexColor("#151515"),
        ),
        "role": ParagraphStyle(
            "Role",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=11.2,
            textColor=colors.HexColor("#111111"),
            spaceBefore=1.2,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.85,
            leading=10.65,
            leftIndent=4 * mm,
            firstLineIndent=-3 * mm,
            textColor=colors.HexColor("#151515"),
            spaceAfter=0.6,
        ),
        "compact": ParagraphStyle(
            "Compact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.9,
            leading=10.8,
            textColor=colors.HexColor("#151515"),
            spaceAfter=1,
        ),
    }

    story = [
        Paragraph("JINYANG ZHOU", styles["name"]),
        Paragraph(
            "PRODUCT VISUALIZATION DESIGNER | INDUSTRIAL DESIGNER | TECHNICAL COMMUNICATION",
            styles["headline"],
        ),
        Paragraph(
            'Milan, Italy | +39 3463264241 | '
            '<link href="mailto:jinyang.zhou2026@outlook.com" color="#202020">jinyang.zhou2026@outlook.com</link>',
            styles["contact"],
        ),
        Paragraph(
            'Portfolio: <link href="https://zhoujinyang.com/?utm_source=cv&amp;utm_medium=document&amp;utm_campaign=job_search_2026" color="#202020">https://zhoujinyang.com/</link> | '
            'LinkedIn: <link href="https://www.linkedin.com/in/jinyangzhou/" color="#202020">https://www.linkedin.com/in/jinyangzhou/</link>',
            styles["contact"],
        ),
        Paragraph(
            "Eligible to work in Italy | Notice period: approximately one week",
            styles["contact"],
        ),
    ]

    story += section("Professional Summary", styles)
    story.append(
        Paragraph(
            "Product and industrial designer experienced in product visualization, technical communication, "
            "and engineering collaboration within manufacturing environments. Skilled in photorealistic "
            "rendering, product animation, interactive 3D viewers, and communication assets for product "
            "development, marketing, technical sales, and international customer engagement.",
            styles["body"],
        )
    )

    story += section("Professional Experience", styles)
    story += role(
        "Product Visualization Designer",
        "Peroni Pompe",
        "Corsico, Italy",
        "2025-Present",
        [
            "Created 30+ photorealistic renderings for industrial pump products and pumping systems.",
            "Developed interactive 3D product viewers for customer presentations.",
            "Produced 10+ product animations, including operating simulations, exploded views, and maintenance tutorials.",
            "Designed product catalogs, corporate presentations, and promotional videos for sales, exhibitions, and international customer communication.",
            "Produced exhibition graphics and marketing assets for 4 international trade fairs; collaborated with an external agency on the redesign of the corporate product catalog.",
            "Redesigned product components with engineering teams, improving aesthetics while maintaining manufacturability.",
            "Supported visualization for 5+ customized engineering projects.",
            "Supported 2 Factory Acceptance Tests (FAT) by coordinating technical documentation and facilitating communication between engineering teams and overseas customers.",
        ],
        styles,
    )
    story.append(Spacer(1, 1.4 * mm))
    story += role(
        "UX Design Intern",
        "Elihome",
        "Milan, Italy",
        "2024-2025",
        [
            "Conducted user research and competitive benchmarking across kitchenware products.",
            "Identified user needs and product opportunities through qualitative research.",
            "Supported product strategy and design direction for sustainable kitchenware collections.",
        ],
        styles,
    )
    story.append(Spacer(1, 1.4 * mm))
    story += role(
        "Product Design Intern",
        "Antonio Lanzillo &amp; Partners Studio",
        "Milan, Italy",
        "2024",
        [
            "Developed early-stage product concepts through ideation, sketching, and aesthetic exploration.",
            "Produced 3D models and photorealistic renderings for design reviews and client presentations.",
            "Introduced AI-assisted visualization workflows for product rendering and video production.",
            "Supported the planning and organization of the studio exhibition during Milan Design Week.",
        ],
        styles,
    )

    story += section("Education", styles)
    story.append(
        Paragraph(
            "<b>Bachelor's Degree in Industrial Product Design</b> | Politecnico di Milano | 2026",
            styles["compact"],
        )
    )
    story.append(
        Paragraph(
            "<b>Design for Social Impact, Summer School</b> | The University of Tokyo | 2025",
            styles["compact"],
        )
    )

    story += section("Selected Awards", styles)
    story.append(
        Paragraph(
            "Red Dot Design Award - Inclusive Design (2025) | London Design Awards - Exhibition &amp; Events (2025) | MUSE Design Awards - Smart Home (2024)",
            styles["compact"],
        )
    )

    story += section("Core Competencies and Tools", styles)
    skill_lines = [
        "<b>Core Competencies:</b> Product visualization, industrial design, technical communication, product communication, 3D rendering, product animation, engineering collaboration, visual storytelling",
        "<b>CAD:</b> SOLIDWORKS, Alias, Rhino",
        "<b>Visualization and Motion:</b> KeyShot, Blender, Premiere Pro, After Effects",
        "<b>Creative and Communication:</b> InDesign, Illustrator, Photoshop, Lightroom",
        "<b>Other:</b> Procreate, Figma, AI-assisted visualization tools",
    ]
    for line in skill_lines:
        story.append(Paragraph(line, styles["compact"]))

    story += section("Languages", styles)
    story.append(
        Paragraph("Chinese: Native | English: Professional | Italian: Intermediate", styles["compact"])
    )

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
