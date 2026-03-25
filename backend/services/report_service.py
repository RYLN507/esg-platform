from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import io
from datetime import datetime

# Brand colors
DARK = colors.HexColor('#0A0F1E')
EMERALD = colors.HexColor('#34d399')
BLUE = colors.HexColor('#60a5fa')
PURPLE = colors.HexColor('#a78bfa')
SLATE = colors.HexColor('#475569')
LIGHT = colors.HexColor('#e2e8f0')
WHITE = colors.white
RED = colors.HexColor('#f87171')
YELLOW = colors.HexColor('#fbbf24')


def get_risk_color(risk_level):
    if risk_level == 'Low':
        return EMERALD
    elif risk_level == 'High':
        return RED
    return YELLOW


def generate_esg_report(company_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()
    story = []

    # ── Custom styles ──────────────────────────────────────────
    title_style = ParagraphStyle(
        'Title', fontSize=24, textColor=WHITE,
        fontName='Helvetica-Bold', spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'Subtitle', fontSize=11, textColor=SLATE,
        fontName='Helvetica', spaceAfter=2
    )
    section_style = ParagraphStyle(
        'Section', fontSize=9, textColor=EMERALD,
        fontName='Helvetica-Bold', spaceAfter=6,
        spaceBefore=14, letterSpacing=1.5
    )
    body_style = ParagraphStyle(
        'Body', fontSize=9, textColor=LIGHT,
        fontName='Helvetica', leading=14, spaceAfter=6
    )
    label_style = ParagraphStyle(
        'Label', fontSize=8, textColor=SLATE,
        fontName='Helvetica'
    )

    ticker = company_data.get('ticker', '')
    company_name = company_data.get('company_name', ticker)
    sector = company_data.get('sector', '')
    country = company_data.get('country', '')
    description = company_data.get('description', '')
    scores = company_data.get('scores', {})
    stock = company_data.get('stock', {})
    market_cap = company_data.get('market_cap', 0)
    risk_level = scores.get('risk_level', 'Unknown')
    risk_color = get_risk_color(risk_level)
    today = datetime.now().strftime('%B %d, %Y')

    # ── Header block ───────────────────────────────────────────
    header_data = [[
        Paragraph(f"ESG CLIENT REPORT", ParagraphStyle(
            'tag', fontSize=8, textColor=EMERALD,
            fontName='Helvetica-Bold', letterSpacing=2
        )),
        Paragraph(f"Generated {today}", ParagraphStyle(
            'date', fontSize=8, textColor=SLATE,
            fontName='Helvetica', alignment=TA_RIGHT
        )),
    ]]
    header_table = Table(header_data, colWidths=[85 * mm, 85 * mm])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DARK),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (0, -1), 14),
        ('RIGHTPADDING', (-1, 0), (-1, -1), 14),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6 * mm))

    # ── Company name + meta ─────────────────────────────────────
    story.append(Paragraph(company_name, title_style))
    story.append(Paragraph(f"{ticker}  ·  {sector}  ·  {country}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=SLATE, spaceAfter=8))

    # ── Risk badge row ──────────────────────────────────────────
    cap_str = f"${market_cap / 1e9:.1f}B" if market_cap else "—"
    ret_str = f"{stock.get('year_return_pct', '—')}%" if stock.get('year_return_pct') else "—"

    badge_data = [[
        Paragraph("OVERALL RISK", label_style),
        Paragraph("MARKET CAP", label_style),
        Paragraph("1Y STOCK RETURN", label_style),
        Paragraph("DATA SOURCE", label_style),
    ], [
        Paragraph(f"<b>{risk_level}</b>", ParagraphStyle(
            'risk', fontSize=13, textColor=risk_color, fontName='Helvetica-Bold'
        )),
        Paragraph(f"<b>{cap_str}</b>", ParagraphStyle(
            'cap', fontSize=13, textColor=WHITE, fontName='Helvetica-Bold'
        )),
        Paragraph(f"<b>{ret_str}</b>", ParagraphStyle(
            'ret', fontSize=13,
            textColor=EMERALD if stock.get('year_return_pct', 0) >= 0 else RED,
            fontName='Helvetica-Bold'
        )),
        Paragraph(f"<b>{company_data.get('data_source', 'curated').title()}</b>", ParagraphStyle(
            'src', fontSize=13, textColor=BLUE, fontName='Helvetica-Bold'
        )),
    ]]
    badge_table = Table(badge_data, colWidths=[42.5 * mm] * 4)
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0F172A')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 6 * mm))

    # ── ESG Scores ──────────────────────────────────────────────
    story.append(Paragraph("ESG SCORE BREAKDOWN", section_style))

    score_headers = [
        Paragraph("DIMENSION", label_style),
        Paragraph("SCORE", label_style),
        Paragraph("RISK LEVEL", label_style),
        Paragraph("DESCRIPTION", label_style),
    ]

    def score_row(label, value, color, desc, threshold_low=10, threshold_high=20):
        val = value if value is not None else 0
        if val < threshold_low:
            level, lvl_color = "Low Risk", EMERALD
        elif val < threshold_high:
            level, lvl_color = "Medium Risk", YELLOW
        else:
            level, lvl_color = "High Risk", RED
        return [
            Paragraph(f"<b>{label}</b>", ParagraphStyle('sl', fontSize=10, textColor=color, fontName='Helvetica-Bold')),
            Paragraph(f"<b>{val:.1f}</b>", ParagraphStyle('sv', fontSize=14, textColor=color, fontName='Helvetica-Bold')),
            Paragraph(level, ParagraphStyle('sr', fontSize=9, textColor=lvl_color, fontName='Helvetica-Bold')),
            Paragraph(desc, body_style),
        ]

    score_data = [
        score_headers,
        score_row("Environmental", scores.get('environmental'), EMERALD,
                  "Carbon emissions, energy usage, water management, waste"),
        score_row("Social", scores.get('social'), BLUE,
                  "Labor practices, safety, supply chain, community impact"),
        score_row("Governance", scores.get('governance'), PURPLE,
                  "Board structure, executive pay, ethics, transparency"),
        [
            Paragraph("<b>Total ESG</b>", ParagraphStyle('tl', fontSize=10, textColor=WHITE, fontName='Helvetica-Bold')),
            Paragraph(f"<b>{scores.get('total', 0):.1f}</b>", ParagraphStyle('tv', fontSize=14, textColor=WHITE, fontName='Helvetica-Bold')),
            Paragraph(risk_level, ParagraphStyle('tr', fontSize=9, textColor=risk_color, fontName='Helvetica-Bold')),
            Paragraph("Composite ESG risk score. Lower is better.", body_style),
        ],
    ]

    score_table = Table(score_data, colWidths=[40 * mm, 25 * mm, 35 * mm, 70 * mm])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#0A0F1E')),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#0F172A')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.HexColor('#0A0F1E'), colors.HexColor('#0F172A')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#1e293b')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 6 * mm))

    # ── About ───────────────────────────────────────────────────
    if description:
        story.append(Paragraph("COMPANY OVERVIEW", section_style))
        story.append(Paragraph(description, body_style))
        story.append(Spacer(1, 4 * mm))

    # ── Disclaimer ──────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=SLATE, spaceAfter=6))
    story.append(Paragraph(
        "This report is generated for informational purposes only and does not constitute financial advice. "
        "ESG scores are sourced from public data and curated datasets. Past performance is not indicative "
        "of future results. ESGPlatform · Confidential Client Report",
        ParagraphStyle('disc', fontSize=7, textColor=SLATE, fontName='Helvetica', leading=11)
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()