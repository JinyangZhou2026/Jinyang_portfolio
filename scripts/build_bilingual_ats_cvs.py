from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path("/Users/shots/Documents/Codex/2026-06-08/i-want-to-build-a-personal")
OUTPUT_DIR = ROOT / "output" / "pdf"

CONTACT = {
    "phone": "+39 3463264241",
    "email": "jinyang.zhou2026@outlook.com",
    "portfolio": "https://zhoujinyang.com/",
    "linkedin": "https://www.linkedin.com/in/jinyangzhou/",
}


CONTENT = {
    "EN": {
        "filename": "CV_JinyangZhou_EN_ATS.pdf",
        "title": "Jinyang Zhou - English ATS CV",
        "subject": "Industrial Product Designer | Product Visualization | Technical Communication",
        "headline": "INDUSTRIAL PRODUCT DESIGNER | PRODUCT VISUALIZATION | TECHNICAL COMMUNICATION",
        "location": "Milan, Italy",
        "authorization": "Eligible to work in Italy",
        "notice": "Notice period: approximately one week",
        "labels": {
            "summary": "PROFESSIONAL SUMMARY",
            "experience": "PROFESSIONAL EXPERIENCE",
            "education": "EDUCATION",
            "awards": "SELECTED AWARDS",
            "skills": "CORE COMPETENCIES AND TOOLS",
            "languages": "LANGUAGES",
            "portfolio": "Portfolio",
            "linkedin": "LinkedIn",
        },
        "summary": (
            "Industrial product designer and 2026 Politecnico di Milano graduate with manufacturing "
            "experience in product visualization, technical communication, and engineering collaboration. "
            "Creates photorealistic renderings, product animations, interactive 3D viewers, and communication "
            "assets for product development, marketing, technical sales, and international customers. "
            "Experienced in supporting customized engineering projects and Factory Acceptance Tests."
        ),
        "experience": [
            {
                "header": "Product Visualization Designer | Peroni Pompe | Corsico, Italy | 2025-Present",
                "bullets": [
                    "Created 30+ photorealistic renderings for industrial pump products and pumping systems.",
                    "Developed interactive 3D product viewers and produced 10+ product animations, including operating simulations, exploded views, and maintenance tutorials.",
                    "Designed product catalogs, corporate presentations, and promotional videos for sales, exhibitions, and international customers.",
                    "Produced exhibition graphics and marketing assets for 4 international trade fairs; collaborated with an external agency on the corporate product catalog redesign.",
                    "Redesigned product components with engineering teams, improving aesthetics while maintaining manufacturability.",
                    "Supported visualization for 5+ customized engineering projects.",
                    "Supported 2 Factory Acceptance Tests (FAT) by coordinating technical documentation and communication between engineering teams and international customers.",
                ],
            },
            {
                "header": "UX Design Intern | Elihome | Milan, Italy | 2024-2025",
                "bullets": [
                    "Conducted user research and competitive benchmarking across kitchenware products.",
                    "Identified user needs and product opportunities through qualitative research.",
                    "Supported product strategy and design direction for sustainable kitchenware collections.",
                ],
            },
            {
                "header": "Product Design Intern | Antonio Lanzillo & Partners Studio | Milan, Italy | 2024",
                "bullets": [
                    "Developed early-stage product concepts through ideation, sketching, and aesthetic research.",
                    "Produced 3D models and photorealistic renderings for design reviews and client presentations.",
                    "Introduced AI-assisted visualization workflows for product rendering and video production.",
                    "Supported the planning and organization of the studio exhibition during Milan Design Week.",
                ],
            },
        ],
        "education": [
            "Bachelor's Degree in Industrial Product Design | Politecnico di Milano | 2026",
            "Design for Social Impact, Summer School | The University of Tokyo | 2025",
        ],
        "awards": (
            "Red Dot Design Award - Inclusive Design (2025) | London Design Awards - Exhibition &amp; "
            "Events (2025) | MUSE Design Awards - Smart Home (2024)"
        ),
        "skills": [
            "Core Competencies: Industrial product design; product visualization; technical communication; product communication; 3D rendering; product animation; interactive 3D visualization; engineering collaboration; user research; visual storytelling",
            "CAD and 3D: SOLIDWORKS; Alias; Rhino; KeyShot; Blender",
            "Creative and Communication: InDesign; Illustrator; Photoshop; Premiere Pro; After Effects; Lightroom",
            "Additional: Figma; Procreate; AI-assisted visualization tools",
        ],
        "languages": "Chinese: Native | English: B2 | Italian: B2",
    },
    "IT": {
        "filename": "CV_JinyangZhou_IT_ATS.pdf",
        "title": "Jinyang Zhou - CV ATS Italiano",
        "subject": "Designer di Prodotto Industriale | Visualizzazione di Prodotto | Comunicazione Tecnica",
        "headline": "DESIGNER DI PRODOTTO INDUSTRIALE | VISUALIZZAZIONE DI PRODOTTO | COMUNICAZIONE TECNICA",
        "location": "Milano, Italia",
        "authorization": "Autorizzata a lavorare in Italia",
        "notice": "Preavviso: circa una settimana",
        "labels": {
            "summary": "PROFILO PROFESSIONALE",
            "experience": "ESPERIENZA PROFESSIONALE",
            "education": "FORMAZIONE",
            "awards": "PREMI SELEZIONATI",
            "skills": "COMPETENZE E STRUMENTI",
            "languages": "LINGUE",
            "portfolio": "Portfolio",
            "linkedin": "LinkedIn",
        },
        "summary": (
            "Designer di prodotto industriale, laureata al Politecnico di Milano nel 2026, con esperienza "
            "in visualizzazione di prodotto, comunicazione tecnica e collaborazione con l'ingegneria in ambito "
            "manifatturiero. Sviluppa rendering fotorealistici, animazioni, visualizzatori 3D interattivi e "
            "materiali di comunicazione a supporto dello sviluppo prodotto, del marketing, delle vendite tecniche "
            "e dei clienti internazionali. Esperienza nel supporto a progetti ingegneristici personalizzati e collaudi FAT."
        ),
        "experience": [
            {
                "header": "Designer di Visualizzazione di Prodotto | Peroni Pompe | Corsico, Italia | 2025-Oggi",
                "bullets": [
                    "Realizzati oltre 30 rendering fotorealistici per prodotti industriali e sistemi di pompaggio.",
                    "Sviluppati visualizzatori 3D interattivi e prodotte oltre 10 animazioni di prodotto, incluse simulazioni operative, viste esplose e tutorial di manutenzione.",
                    "Progettati cataloghi, presentazioni aziendali e video promozionali per vendite, fiere e clienti internazionali.",
                    "Create grafiche espositive e materiali di marketing per 4 fiere internazionali; collaborazione con un'agenzia esterna alla riprogettazione del catalogo prodotti aziendale.",
                    "Riprogettati componenti con il team di ingegneria, migliorandone l'estetica e preservandone la fattibilità produttiva.",
                    "Supportata la visualizzazione di oltre 5 progetti ingegneristici personalizzati.",
                    "Supportati 2 collaudi di accettazione in fabbrica (FAT), coordinando la documentazione tecnica e la comunicazione tra il team di ingegneria e i clienti internazionali.",
                ],
            },
            {
                "header": "Tirocinante in UX Design | Elihome | Milano, Italia | 2024-2025",
                "bullets": [
                    "Condotte ricerche utente e analisi comparative sui prodotti per cucina.",
                    "Individuati bisogni e opportunità di prodotto tramite ricerca qualitativa.",
                    "Contributo alla strategia di prodotto e alla direzione progettuale per collezioni sostenibili di utensili da cucina.",
                ],
            },
            {
                "header": "Tirocinante in Design di Prodotto | Antonio Lanzillo & Partners Studio | Milano, Italia | 2024",
                "bullets": [
                    "Sviluppati concept di prodotto attraverso ideazione, sketch e ricerca estetica.",
                    "Realizzati modelli 3D e rendering fotorealistici per revisioni progettuali e presentazioni ai clienti.",
                    "Introdotti flussi di visualizzazione assistiti dall'IA per rendering e video di prodotto.",
                    "Supportata la pianificazione e l'organizzazione della mostra dello studio durante la Milano Design Week.",
                ],
            },
        ],
        "education": [
            "Laurea triennale in Design del prodotto industriale | Politecnico di Milano | 2026",
            "Design per l'impatto sociale, Summer School | The University of Tokyo | 2025",
        ],
        "awards": (
            "Red Dot Design Award - Inclusive Design (2025) | London Design Awards - Exhibition &amp; "
            "Events (2025) | MUSE Design Awards - Smart Home (2024)"
        ),
        "skills": [
            "Competenze principali: Design del prodotto industriale; visualizzazione di prodotto; comunicazione tecnica; comunicazione di prodotto; rendering 3D; animazione di prodotto; visualizzazione 3D interattiva; collaborazione con l'ingegneria; ricerca utente; storytelling visivo",
            "CAD e 3D: SOLIDWORKS; Alias; Rhino; KeyShot; Blender",
            "Grafica e comunicazione: InDesign; Illustrator; Photoshop; Premiere Pro; After Effects; Lightroom",
            "Altro: Figma; Procreate; strumenti di visualizzazione assistita dall'IA",
        ],
        "languages": "Cinese: Madrelingua | Inglese: B2 | Italiano: B2",
    },
}


def make_styles():
    styles = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=21,
            leading=22,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#151515"),
            spaceAfter=1.5,
        ),
        "headline": ParagraphStyle(
            "Headline",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.8,
            leading=11.2,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#202020"),
            spaceAfter=2,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.9,
            leading=10.5,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#202020"),
            spaceAfter=0.5,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.8,
            leading=12.0,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#111111"),
            spaceBefore=5.5,
            spaceAfter=2.2,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=11.4,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#202020"),
            spaceAfter=1.2,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.6,
            leading=11.2,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#151515"),
            spaceBefore=1.4,
            spaceAfter=0.9,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=10.8,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#202020"),
            leftIndent=8,
            firstLineIndent=-6,
            spaceAfter=0.55,
        ),
    }


def add_section(story, styles, title):
    story.append(Paragraph(escape(title), styles["section"]))


def build_cv(language, data):
    output_path = OUTPUT_DIR / data["filename"]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    styles = make_styles()

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        rightMargin=14 * mm,
        leftMargin=14 * mm,
        topMargin=10 * mm,
        bottomMargin=10 * mm,
        title=data["title"],
        author="Jinyang Zhou",
        subject=data["subject"],
        creator="Codex - ReportLab ATS CV Builder",
    )

    labels = data["labels"]
    story = [
        Paragraph("JINYANG ZHOU", styles["name"]),
        Paragraph(escape(data["headline"]), styles["headline"]),
        Paragraph(
            f'{escape(data["location"])} | {escape(CONTACT["phone"])} | '
            f'<link href="mailto:{CONTACT["email"]}" color="#202020">{CONTACT["email"]}</link>',
            styles["contact"],
        ),
        Paragraph(
            f'{escape(labels["portfolio"])}: '
            f'<link href="{CONTACT["portfolio"]}" color="#202020">{CONTACT["portfolio"]}</link> | '
            f'{escape(labels["linkedin"])}: '
            f'<link href="{CONTACT["linkedin"]}" color="#202020">{CONTACT["linkedin"]}</link>',
            styles["contact"],
        ),
        Paragraph(
            f'{escape(data["authorization"])} | {escape(data["notice"])}',
            styles["contact"],
        ),
    ]

    add_section(story, styles, labels["summary"])
    story.append(Paragraph(escape(data["summary"]), styles["body"]))

    add_section(story, styles, labels["experience"])
    for experience in data["experience"]:
        block = [Paragraph(escape(experience["header"]), styles["role"])]
        block.extend(
            Paragraph(f'- {escape(bullet)}', styles["bullet"])
            for bullet in experience["bullets"]
        )
        story.append(KeepTogether(block))

    add_section(story, styles, labels["education"])
    for item in data["education"]:
        story.append(Paragraph(escape(item), styles["body"]))

    add_section(story, styles, labels["awards"])
    story.append(Paragraph(data["awards"], styles["body"]))

    add_section(story, styles, labels["skills"])
    for item in data["skills"]:
        label, value = item.split(":", 1)
        story.append(
            Paragraph(f'<b>{escape(label)}:</b>{escape(value)}', styles["body"])
        )

    add_section(story, styles, labels["languages"])
    story.append(Paragraph(escape(data["languages"]), styles["body"]))

    doc.build(story)
    return output_path


if __name__ == "__main__":
    for language_code, language_data in CONTENT.items():
        path = build_cv(language_code, language_data)
        print(path)
