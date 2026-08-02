from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "finance-decision-checklist.pdf"
PUBLIC = ROOT / "public" / "downloads" / "finance-decision-checklist.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
PUBLIC.parent.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#0F172A")
MUTED = colors.HexColor("#64748B")
BLUE = colors.HexColor("#2563EB")
PALE = colors.HexColor("#EFF6FF")
LINE = colors.HexColor("#DCE5F0")

styles = getSampleStyleSheet()
eyebrow = ParagraphStyle("Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=BLUE, spaceAfter=7, uppercase=True)
title = ParagraphStyle("Title", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=25, leading=29, textColor=INK, alignment=TA_LEFT, spaceAfter=12)
lead = ParagraphStyle("Lead", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.5, leading=16, textColor=MUTED, spaceAfter=16)
question = ParagraphStyle("Question", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=11, leading=15, textColor=INK)
prompt = ParagraphStyle("Prompt", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=MUTED)
small = ParagraphStyle("Small", parent=styles["BodyText"], fontName="Helvetica", fontSize=8, leading=11, textColor=MUTED)
section = ParagraphStyle("Section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=15, leading=18, textColor=INK, spaceBefore=4, spaceAfter=10)

questions = [
    ("1", "What value will this decision create?", "Name the customer, operating, strategic, or financial value. Separate a useful outcome from a merely attractive activity."),
    ("2", "Which cash flows will actually change?", "Compare the decision with the realistic alternative. Include opportunity cost, working capital, tax, maintenance, and exit cash flows."),
    ("3", "When will cash enter and leave the company?", "Place major payments and receipts on a timeline. Mark the lowest cash point and the moment value is expected to arrive."),
    ("4", "What assumptions drive the result?", "Identify the few assumptions that move the answer most: volume, price, timing, cost, adoption, financing, or execution capacity."),
    ("5", "What happens in the downside scenario?", "State a plausible downside, not an imaginary catastrophe. Show the effect on cash, covenants, delivery, reputation, and future choices."),
    ("6", "Is the decision reversible?", "Can the company stage, delay, test, resize, pause, sell, or exit? Name the next decision point and the evidence required there."),
    ("7", "What liquidity or financing constraints exist?", "Check minimum cash, debt service, covenant headroom, refinancing dates, currency exposure, and access to emergency capacity."),
    ("8", "Who owns the risk?", "Name who monitors the risk, who may change the plan, who may stop it, and who challenges the assumptions independently."),
    ("9", "How will performance be measured?", "Use a small set of measures that connect learning, operations, cash, risk, and value. Check what behaviour each measure may reward."),
    ("10", "What evidence would change the decision?", "Write the threshold for invest, stage, delay, or reject before the meeting. A useful recommendation states how it can be proven wrong."),
]

def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 16 * mm, A4[0] - 18 * mm, 16 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 10.5 * mm, "MapKAI - Corporate Finance Essentials")
    canvas.drawRightString(A4[0] - 18 * mm, 10.5 * mm, f"Page {doc.page}")
    canvas.restoreState()

story = [
    Paragraph("MAPKAI DECISION TOOL", eyebrow),
    Paragraph("Finance Decision Checklist for Non-Finance Managers", title),
    Paragraph("Use these ten questions before approving an investment, project, financing choice, partnership, or operating change. The checklist is designed to improve judgment, not to replace professional advice or a full financial review.", lead),
]

for index, (number, heading, guidance) in enumerate(questions):
    if index == 5:
        story.append(PageBreak())
        story.extend([Paragraph("FROM DOWNSIDE TO DECISION", eyebrow), Spacer(1, 1 * mm)])
    number_cell = Table([[Paragraph(number, question)]], colWidths=[10 * mm], rowHeights=[10 * mm])
    number_cell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.7, BLUE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    content = [Paragraph(heading, question), Spacer(1, 1.5 * mm), Paragraph(guidance, prompt), Spacer(1, 2 * mm), Table([["Notes / evidence:"] , [""]], colWidths=[145 * mm], rowHeights=[4.5 * mm, 10 * mm], style=TableStyle([
        ("FONT", (0, 0), (-1, 0), "Helvetica", 7.5),
        ("TEXTCOLOR", (0, 0), (-1, 0), MUTED),
        ("BOX", (0, 1), (-1, 1), 0.6, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))]
    content_table = Table([[content]], colWidths=[150 * mm])
    content_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    row = Table([[number_cell, content_table]], colWidths=[14 * mm, 150 * mm], hAlign="LEFT")
    row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm)]))
    story.append(row)

story.extend([
    Spacer(1, 3 * mm),
    Paragraph("FINAL RECOMMENDATION", eyebrow),
    Table([
        ["INVEST", "STAGE", "DELAY", "REJECT"],
        ["", "", "", ""],
    ], colWidths=[41 * mm] * 4, rowHeights=[7 * mm, 10 * mm], style=TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONT", (0, 0), (-1, 0), "Helvetica-Bold", 8),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.7, LINE),
    ])),
    Spacer(1, 5 * mm),
    Paragraph("Decision owner: ____________________    Review date: ____________________    Evidence that would reopen the decision: __________________________________________", small),
])

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=18 * mm, bottomMargin=22 * mm, title="Finance Decision Checklist for Non-Finance Managers", author="MapKAI")
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
copyfile(OUTPUT, PUBLIC)
print(f"Created {OUTPUT}")
print(f"Copied {PUBLIC}")
