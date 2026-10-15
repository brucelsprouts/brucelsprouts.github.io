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
        fontName='Helvetica-Bold', fontSize=20, leading=23,
        textColor=BLACK)

    tagline_style = ParagraphStyle('Tagline',
        fontName='Helvetica', fontSize=10.5, leading=13,
        textColor=DARK_GREY, spaceBefore=2)

    contact_style = ParagraphStyle('Contact',
        fontName='Helvetica', fontSize=9, leading=12,
        textColor=DARK_GREY, spaceBefore=2)

    section_style = ParagraphStyle('Section',
        fontName='Helvetica-Bold', fontSize=9, leading=11,
        textColor=BLACK, spaceBefore=6, spaceAfter=3,
        letterSpacing=1.5)

    entry_title_style = ParagraphStyle('EntryTitle',
        fontName='Helvetica-Bold', fontSize=10.5, leading=12.5,
        textColor=BLACK)

    entry_sub_style = ParagraphStyle('EntrySub',
        fontName='Helvetica', fontSize=9.5, leading=11.5,
        textColor=DARK_GREY, spaceBefore=0)

    entry_date_style = ParagraphStyle('EntryDate',
        fontName='Helvetica', fontSize=9, leading=12,
        textColor=MID_GREY, alignment=TA_RIGHT)

    bullet_style = ParagraphStyle('Bullet',
        fontName='Helvetica', fontSize=9.5, leading=12.5,
        textColor=HexColor('#333333'), spaceBefore=2,
        leftIndent=11, bulletIndent=2, bulletFontSize=9.5)

    skill_label_style = ParagraphStyle('SkillLabel',
        fontName='Helvetica-Bold', fontSize=9.5, leading=12,
        textColor=DARK_GREY)

    skill_val_style = ParagraphStyle('SkillVal',
        fontName='Helvetica', fontSize=9.5, leading=12,
        textColor=BLACK)

    proj_stack_style = ParagraphStyle('ProjStack',
        fontName='Helvetica', fontSize=8.5, leading=11,
        textColor=MID_GREY, spaceBefore=0, spaceAfter=1)

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

# Reportlab frames pad 6pt each side; scale tables to fit so they align with paragraphs.
FRAME_FIT = (7.2*inch - 12) / (7.2*inch)

def link(url, text=None):
    return f'<a href="{url}" color="#1a4fa0">{text or url.split("://",1)[-1].rstrip("/")}</a>'

# ── Helpers ──────────────────────────────────────────────────
def rule(thickness=0.6, color=RULE_GREY, space=3):
    return HRFlowable(width='100%', thickness=thickness,
                      color=color, spaceAfter=space, spaceBefore=0)

def section(title):
    return [
        Spacer(1, 11),
        Paragraph(title.upper(), S['section']),
        rule(),
    ]

def bullet(text):
    return Paragraph(text, S['bullet'], bulletText='\u2022')

def entry_row(left_top, left_sub, right_text, bullets=None):
    """Two-column row: left (title + sub), right (date). Optional bullets below."""
    left_cell  = [Paragraph(left_top, S['entry_title'])]
    if left_sub:
        left_cell.append(Paragraph(left_sub, S['entry_sub']))
    right_cell = [Paragraph(right_text, S['entry_date'])]

    t = Table([[left_cell, right_cell]],
              colWidths=[5.4*inch*FRAME_FIT, 1.8*inch*FRAME_FIT])
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
            items.append(bullet(b))
        items.append(Spacer(1, 9))
    return KeepTogether(items)

def project_block(title, url_text, stack, bullets, tag=''):
    tag_html = f'<font name="Helvetica" size="9.5" color="#555555">  \u00b7  {tag}</font>' if tag else ''
    header_left  = Paragraph(f'<b>{title}</b>{tag_html}', S['entry_title'])
    header_right = Paragraph(url_text, S['link'])

    t = Table([[header_left, header_right]],
              colWidths=[4.18*inch*FRAME_FIT, 3.02*inch*FRAME_FIT])
    t.setStyle(TableStyle([
        ('VALIGN',       (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING',  (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING',   (0,0), (-1,-1), 0),
        ('BOTTOMPADDING',(0,0), (-1,-1), 0),
    ]))

    items = [t, Paragraph(stack, S['proj_stack'])]
    for b in bullets:
        items.append(bullet(b))
    items.append(Spacer(1, 9))
    return KeepTogether(items)

def skills_row(label, value):
    t = Table([[Paragraph(label, S['skill_label']),
                Paragraph(value, S['skill_val'])]],
              colWidths=[1.3*inch*FRAME_FIT, 5.9*inch*FRAME_FIT])
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
        bottomMargin=0.5*inch,
    )

    story = []

    # ── HEADER ──────────────────────────────────────────────
    story.append(Paragraph('Bruce Lin', S['name']))
    story.append(Paragraph('Full-Stack Developer  \u00b7  Seeking full-time roles from Spring 2027', S['tagline']))
    story.append(Paragraph(
        '(437) 988-4102  \u00b7  ' + link('mailto:email@brucelsprouts.com', 'email@brucelsprouts.com'),
        S['contact']))
    story.append(Paragraph(
        link('https://brucelsprouts.com') + '  \u00b7  ' + link('https://github.com/brucelsprouts') +
        '  \u00b7  ' + link('https://www.linkedin.com/in/bruce-lin-6284b323b/', 'linkedin.com/in/bruce-lin-6284b323b'),
        S['contact']))
    story.append(Spacer(1, 4))
    story.append(rule(thickness=1.2, color=BLACK, space=0))

    # ── EDUCATION ───────────────────────────────────────────
    story += section('Education')
    story.append(entry_row(
        'Western University',
        'Bachelor of Science, Computer Science  \u00b7  Expected Graduation: Spring 2027',
        'London, ON  \u00b7  2023\u2013Present',
    ))

    # ── PROJECTS ────────────────────────────────────────────
    story += section('Projects')

    story.append(project_block(
        'Deckira',
        'Website live  \u00b7  App Store release in progress',
        'TypeScript  \u00b7  React  \u00b7  Tauri  \u00b7  React Native (Expo)  \u00b7  Supabase',
        [
            'Co-developing a spaced-repetition flashcard app for students on web, desktop, and mobile.',
            'Own the front end on all three (FSRS scheduling, offline sync, media cards) and contribute to the Supabase back end.',
        ],
        tag='Flashcard app for students',
    ))

    story.append(project_block(
        'Ladder',
        link('https://ladder.brucelsprouts.com/demo', 'ladder.brucelsprouts.com/demo'),
        'Next.js  \u00b7  TypeScript  \u00b7  Supabase (Postgres)  \u00b7  Gmail API  \u00b7  Vitest  \u00b7  PM2',
        [
            'Built a job tracker whose worker polls Greenhouse, Lever, Ashby, and SmartRecruiters and scores postings.',
            'Reads Gmail over OAuth (encrypted tokens) to update application statuses, with live Sankey stats and a Vitest suite.',
        ],
        tag='Job-application tracker',
    ))

    story.append(project_block(
        'Nocturne',
        link('https://nocturne.brucelsprouts.com'),
        'React  \u00b7  TypeScript  \u00b7  React Three Fiber  \u00b7  GLSL  \u00b7  Supabase  \u00b7  Oracle Cloud',
        [
            'Built an adaptive typing trainer that scores each key, letter pair, and finger and drills the slowest pairs.',
            'Shipped end to end: a raymarched WebGL interface, with progress synced to self-hosted Supabase.',
        ],
        tag='Touch-typing trainer',
    ))

    story.append(project_block(
        'Tempo',
        link('https://github.com/brucelsprouts/tempo'),
        'Next.js  \u00b7  TypeScript  \u00b7  Supabase  \u00b7  Tailwind CSS',
        [
            'Designed a calendar with no month pages: one virtualised, continuous scroll of week rows.',
            'Stored each recurring event as one RFC 5545 rule expanded at render time, not as a row per date.',
        ],
        tag='Continuous-scroll calendar',
    ))

    # ── EXPERIENCE ──────────────────────────────────────────
    story += section('Experience')

    story.append(entry_row(
        'Lead Developer, Designer &amp; Facilitator',
        'Toronto STEM Exploration Camp  \u00b7  ' + link('https://tsecamp.ca'),
        'Apr\u2013Aug 2026',
        bullets=[
            'Designed and built the camp website solo (React, Vite, Tailwind CSS, Vercel) for a free STEM camp for youth aged 8\u201313; phone-first, no backend, and registration filled all 30 spots.',
            'Designed the camp logo and visual identity, and taught hands-on STEM sessions on site during camp week.',
        ],
    ))

    story.append(entry_row(
        'Video Editor',
        'AMG (freelance)  \u00b7  Independent, YouTube',
        'Mar 2024\u2013Present',
        bullets=[
            'Edit client video across several concurrent projects in After Effects (motion graphics, compositing, transitions); started as an on-site intern, now freelance.',
            'Run a YouTube channel (2.4K subscribers) of edits and tutorials; one edit reached 880K views.',
        ],
    ))

    # ── TECHNICAL SKILLS ────────────────────────────────────
    story += section('Technical Skills')
    story.append(skills_row('Languages',
        'TypeScript  \u00b7  JavaScript  \u00b7  Python  \u00b7  Java  \u00b7  SQL  \u00b7  Rust  \u00b7  HTML / CSS'))
    story.append(skills_row('Frameworks',
        'React  \u00b7  Next.js  \u00b7  React Native (Expo)  \u00b7  Tauri  \u00b7  Tailwind CSS  \u00b7  Three.js'))
    story.append(skills_row('Tools & Platforms',
        'Git  \u00b7  Supabase (Postgres)  \u00b7  Node.js  \u00b7  Vercel  \u00b7  Oracle Cloud  \u00b7  Linux  \u00b7  Claude Code'))
    story.append(skills_row('Creative',
        'After Effects  \u00b7  Photoshop  \u00b7  Blender'))

    doc.build(story)
    print(f'PDF written to {OUT}')

if __name__ == '__main__':
    build()
