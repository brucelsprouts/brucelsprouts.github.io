"""
Generates assets/Bruce_Lin_Resume.pdf using reportlab.
Run: python build_resume.py
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, KeepTogether
)
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
import os

OUT = os.path.join(os.path.dirname(__file__), 'assets', 'Bruce_Lin_Resume.pdf')

# ── Colours ──────────────────────────────────────────────────
BLACK      = HexColor('#111111')
DARK_GREY  = HexColor('#444444')
MID_GREY   = HexColor('#666666')
LIGHT_GREY = HexColor('#999999')
RULE_GREY  = HexColor('#cccccc')

# ── Styles ───────────────────────────────────────────────────
def make_styles():
    base = dict(fontName='Helvetica', fontSize=10, leading=14,
                textColor=BLACK, spaceAfter=0, spaceBefore=0)

    name_style = ParagraphStyle('Name',
        fontName='Helvetica-Bold', fontSize=22, leading=26,
        textColor=BLACK)

    tagline_style = ParagraphStyle('Tagline',
        fontName='Helvetica', fontSize=10.5, leading=13,
        textColor=DARK_GREY, spaceBefore=2)

    contact_style = ParagraphStyle('Contact',
        fontName='Helvetica', fontSize=9, leading=12,
        textColor=DARK_GREY, spaceBefore=5)

    section_style = ParagraphStyle('Section',
        fontName='Helvetica-Bold', fontSize=8, leading=10,
        textColor=MID_GREY, spaceBefore=10, spaceAfter=4,
        letterSpacing=1.5)

    entry_title_style = ParagraphStyle('EntryTitle',
        fontName='Helvetica-Bold', fontSize=10.5, leading=13,
        textColor=BLACK)

    entry_sub_style = ParagraphStyle('EntrySub',
        fontName='Helvetica', fontSize=9.5, leading=12,
        textColor=DARK_GREY, spaceBefore=1)

    entry_date_style = ParagraphStyle('EntryDate',
        fontName='Helvetica', fontSize=9, leading=12,
        textColor=MID_GREY, alignment=TA_RIGHT)

    bullet_style = ParagraphStyle('Bullet',
        fontName='Helvetica', fontSize=9.5, leading=13,
        textColor=HexColor('#333333'), spaceBefore=2,
        leftIndent=12, firstLineIndent=-12)

    skill_label_style = ParagraphStyle('SkillLabel',
        fontName='Helvetica-Bold', fontSize=9.5, leading=13,
        textColor=DARK_GREY)

    skill_val_style = ParagraphStyle('SkillVal',
        fontName='Helvetica', fontSize=9.5, leading=13,
        textColor=BLACK)

    proj_stack_style = ParagraphStyle('ProjStack',
        fontName='Helvetica', fontSize=8.5, leading=11,
        textColor=MID_GREY, spaceBefore=1, spaceAfter=2)

    link_style = ParagraphStyle('Link',
        fontName='Helvetica', fontSize=8.5, leading=11,
        textColor=MID_GREY, alignment=TA_RIGHT)

    return {
        'name': name_style, 'tagline': tagline_style,
        'contact': contact_style, 'section': section_style,
        'entry_title': entry_title_style, 'entry_sub': entry_sub_style,
        'entry_date': entry_date_style, 'bullet': bullet_style,
        'skill_label': skill_label_style, 'skill_val': skill_val_style,
        'proj_stack': proj_stack_style, 'link': link_style,
    }

S = make_styles()

# ── Helpers ──────────────────────────────────────────────────
def rule(thickness=0.6, color=RULE_GREY, space=3):
    return HRFlowable(width='100%', thickness=thickness,
                      color=color, spaceAfter=space, spaceBefore=0)

def section(title):
    return [
        Spacer(1, 6),
        Paragraph(title.upper(), S['section']),
        rule(),
    ]

def bullet(text):
    return Paragraph(f'\u2022\u2002{text}', S['bullet'])

def entry_row(left_top, left_sub, right_text, bullets=None):
    """Two-column row: left (title + sub), right (date). Optional bullets below."""
    left_cell  = [Paragraph(left_top, S['entry_title'])]
    if left_sub:
        left_cell.append(Paragraph(left_sub, S['entry_sub']))
    right_cell = [Paragraph(right_text, S['entry_date'])]

    t = Table([[left_cell, right_cell]],
              colWidths=[5.4*inch, 1.8*inch])
    t.setStyle(TableStyle([
        ('VALIGN',      (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING',(0,0), (-1,-1), 0),
        ('TOPPADDING',  (0,0), (-1,-1), 0),
        ('BOTTOMPADDING',(0,0),(-1,-1), 0),
    ]))

    items = [t]
    if bullets:
        for b in bullets:
            items.append(Spacer(1, 1))
            items.append(bullet(b))
        items.append(Spacer(1, 4))
    return KeepTogether(items)

def project_block(title, url_text, stack, bullets):
    header_left  = Paragraph(f'<b>{title}</b>', S['entry_title'])
    header_right = Paragraph(url_text, S['link'])

    t = Table([[header_left, header_right]],
              colWidths=[4.18*inch, 3.02*inch])
    t.setStyle(TableStyle([
        ('VALIGN',       (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING',  (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING',   (0,0), (-1,-1), 0),
        ('BOTTOMPADDING',(0,0), (-1,-1), 0),
    ]))

    items = [t, Paragraph(stack, S['proj_stack'])]
    for b in bullets:
        items.append(Spacer(1, 1))
        items.append(bullet(b))
    items.append(Spacer(1, 5))
    return KeepTogether(items)

def skills_row(label, value):
    t = Table([[Paragraph(label, S['skill_label']),
                Paragraph(value, S['skill_val'])]],
              colWidths=[1.15*inch, 6.05*inch])
    t.setStyle(TableStyle([
        ('VALIGN',       (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING',  (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING',   (0,0), (-1,-1), 0),
        ('BOTTOMPADDING',(0,0), (-1,-1), 2),
    ]))
    return t

# ── Build ─────────────────────────────────────────────────────
def build():
    doc = SimpleDocTemplate(
        OUT,
        pagesize=letter,
        leftMargin=0.65*inch,
        rightMargin=0.65*inch,
        topMargin=0.55*inch,
        bottomMargin=0.55*inch,
    )

    story = []

    # ── HEADER ──────────────────────────────────────────────
    story.append(Paragraph('Bruce Lin', S['name']))
    story.append(Paragraph('Computer Science Student &amp; Front-End Developer', S['tagline']))
    story.append(Paragraph(
        '(437) 988-4102  \u00b7  email@brucelsprouts.com  \u00b7  '
        'brucelsprouts.com  \u00b7  github.com/brucelsprouts  \u00b7  '
        'linkedin.com/in/bruce-lin-6284b323b',
        S['contact']))
    story.append(Spacer(1, 4))
    story.append(rule(thickness=1.2, color=BLACK, space=0))

    # ── EDUCATION ───────────────────────────────────────────
    story += section('Education')
    story.append(entry_row(
        'University of Western Ontario \u2014 Western University',
        'Bachelor of Science, Computer Science  \u00b7  Expected Graduation: Spring 2027',
        'London, ON  \u00b7  2023\u2013Present',
    ))

    # ── TECHNICAL SKILLS ────────────────────────────────────
    story += section('Technical Skills')
    story.append(skills_row(
        'Languages',
        'Java  \u00b7  Python  \u00b7  JavaScript  \u00b7  TypeScript  \u00b7  PHP  \u00b7  Rust  \u00b7  HTML  \u00b7  CSS'
    ))
    story.append(skills_row(
        'Tools & Platforms',
        'Git  \u00b7  Linux / Unix  \u00b7  Oracle Cloud  \u00b7  Tauri  \u00b7  Node.js'
    ))
    story.append(skills_row(
        'Libraries',
        'Three.js  \u00b7  GSAP  \u00b7  Tkinter'
    ))
    story.append(skills_row(
        'Creative',
        'After Effects  \u00b7  Photoshop  \u00b7  Blender'
    ))
    story.append(Spacer(1, 2))

    # ── PROJECTS ────────────────────────────────────────────
    story += section('Projects')

    story.append(project_block(
        'ClipStack',
        'github.com/brucelsprouts/clipstack',
        'Tauri  \u00b7  Rust  \u00b7  TypeScript',
        [
            'Built a cross-platform desktop clipboard manager using Tauri, combining a Rust backend with a TypeScript/HTML frontend in a single native binary.',
            'Implemented persistent clip history, image preview, full-text search, pinned clips, a global keyboard shortcut, and light/dark themes.',
        ]
    ))

    story.append(project_block(
        'Personal Portfolio \u2014 brucelsprouts.com',
        'brucelsprouts.com  \u00b7  github.com/brucelsprouts/brucelsprouts.github.io',
        'HTML  \u00b7  CSS  \u00b7  JavaScript  \u00b7  Three.js  \u00b7  GSAP',
        [
            'Designed and built a cyber-tech themed portfolio from scratch with no CSS or JavaScript frameworks.',
            'Integrated a Three.js 3D particle system, GSAP scroll animations, URL deep-linking, a hidden aim-trainer minigame, and a low-performance accessibility mode.',
        ]
    ))

    story.append(project_block(
        'XPWaste',
        'github.com/brucelsprouts/xpwaste',
        'Python  \u00b7  Tkinter  \u00b7  PyInstaller',
        [
            'Developed a desktop focus timer featuring session history logging, custom notification sounds, and dual themes; packaged as a standalone Windows executable requiring no Python install.',
        ]
    ))

    story.append(project_block(
        'Nixie Counter',
        'github.com/brucelsprouts/nixiecounter',
        'PHP  \u00b7  Node.js  \u00b7  Oracle Cloud  \u00b7  SVG',
        [
            'Deployed a server-side visitor counter on Oracle Cloud that generates and streams a real-time Nixie-tube SVG image; embeds in any GitHub README or webpage via a single URL.',
        ]
    ))

    # ── EXPERIENCE ──────────────────────────────────────────
    story += section('Experience')

    story.append(entry_row(
        'Video Editing Intern',
        'AMG',
        'Summer 2024',
        bullets=[
            'Edited and delivered video content using After Effects and Premiere; produced motion graphics, compositing, and transitions for client-ready deliverables.',
            'Managed timelines across multiple concurrent projects in a professional production environment.',
        ]
    ))

    story.append(entry_row(
        'English Tutor',
        'Ignite Youth Club',
        '2021\u20132023',
        bullets=[
            'Tutored students in English comprehension and writing in a structured youth program; adapted teaching approach to individual learning needs.',
        ]
    ))

    doc.build(story)
    print(f'PDF written to {OUT}')

if __name__ == '__main__':
    build()
