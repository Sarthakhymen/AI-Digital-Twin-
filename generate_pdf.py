import os
import sys
import subprocess
import re

# 1. Dynamically check and install dependencies
try:
    from fpdf import FPDF
except ImportError:
    print("Installing fpdf2 library dynamically for premium PDF generation...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "fpdf2"])
    from fpdf import FPDF

class CorporatePDF(FPDF):
    def header(self):
        # Header only on page 2 and later
        if self.page_no() == 1:
            return
        
        self.set_font("helvetica", "I", 8)
        self.set_text_color(100, 116, 139) # Slate 500
        
        # Title on left, Confidential on right
        self.cell(100, 8, "AI Digital Twin - Official Knowledge Base & Support Guide", align="L")
        self.cell(70, 8, "CONFIDENTIAL", align="R")
        self.ln(8)
        
        # Subtle horizontal divider
        self.set_draw_color(226, 232, 240) # Slate 200
        self.set_line_width(0.5)
        self.line(20, 24, 190, 24)
        self.ln(6)

    def footer(self):
        if self.page_no() == 1:
            return
        
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(148, 163, 184) # Slate 400
        
        # Divider line
        self.set_draw_color(241, 245, 249) # Slate 100
        self.line(20, self.get_y() - 2, 190, self.get_y() - 2)
        
        # Left: Copyright, Right: Page X of Y
        self.cell(100, 10, "© AI Digital Twin. All Rights Reserved.", align="L")
        self.cell(70, 10, f"Page {self.page_no()} of {{nb}}", align="R")

def build_pdf():
    # Read the markdown source file
    md_path = "AI_Assistant_Knowledge_Base.md"
    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found in the current directory.")
        return
        
    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    pdf = CorporatePDF(orientation="P", unit="mm", format="A4")
    pdf.set_margins(20, 20, 20)
    pdf.alias_nb_pages()
    
    # ------------------ COVER PAGE ------------------
    pdf.add_page()
    
    # Title Spacer
    pdf.ln(40)
    
    # Category Tag
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(14, 165, 233) # Sky 500 Accent
    pdf.cell(0, 6, "OFFICIAL SYSTEM KNOWLEDGE BASE", ln=True, align="L")
    pdf.ln(2)
    
    # Master Title
    pdf.set_font("helvetica", "B", 28)
    pdf.set_text_color(15, 23, 42) # Slate 900
    pdf.multi_cell(0, 12, "AI Digital Twin")
    
    # Divider
    pdf.set_draw_color(15, 23, 42)
    pdf.set_line_width(1.5)
    pdf.line(20, pdf.get_y() + 2, 80, pdf.get_y() + 2)
    pdf.ln(8)
    
    # Subtitle
    pdf.set_font("helvetica", "regular", 14)
    pdf.set_text_color(71, 85, 105) # Slate 600
    pdf.multi_cell(0, 8, "Exhaustive Customer Support Assistant Knowledge Pool & Comprehensive User FAQ Reference Document")
    
    pdf.ln(50)
    
    # Info Section Block
    pdf.set_fill_color(248, 250, 252) # Slate 50
    pdf.set_draw_color(226, 232, 240) # Slate 200
    pdf.set_line_width(0.5)
    pdf.rect(20, pdf.get_y(), 170, 48, style="FD")
    
    pdf.set_xy(25, pdf.get_y() + 4)
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, "DOCUMENT METADATA", ln=True)
    
    pdf.set_font("helvetica", "regular", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.set_x(25)
    pdf.cell(0, 5, "Target Audience: Support AI Twin & Live Chat Engineers", ln=True)
    pdf.set_x(25)
    pdf.cell(0, 5, "Security Clearance: Confidential / Internal System Training", ln=True)
    pdf.set_x(25)
    pdf.cell(0, 5, "Support Email: nexora.aidigital.twin@gmail.com", ln=True)
    pdf.set_x(25)
    pdf.cell(0, 5, "Hotline Assistance: +91 9625410112", ln=True)
    pdf.set_x(25)
    pdf.cell(0, 5, "Version: 1.1 (Production Ready)", ln=True)
    
    # ------------------ MAIN CONTENT ------------------
    pdf.add_page()
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(51, 65, 85) # Slate 700
    
    for line in lines:
        line = line.strip()
        
        # Replace Rupee symbol with 'Rs.' for Helvetica compatibility
        line = line.replace("₹", "Rs. ")
        
        # Skip horizontal dividers
        if line == "---":
            pdf.ln(4)
            pdf.set_draw_color(241, 245, 249)
            pdf.set_line_width(0.5)
            pdf.line(20, pdf.get_y(), 190, pdf.get_y())
            pdf.ln(4)
            continue
            
        if not line:
            pdf.ln(3)
            continue
            
        # Level 1 Heading (Markdown '# Title')
        if line.startswith("# "):
            title_text = line[2:]
            pdf.ln(6)
            pdf.set_font("helvetica", "B", 18)
            pdf.set_text_color(15, 23, 42) # Slate 900
            pdf.multi_cell(0, 10, title_text)
            pdf.ln(4)
            
        # Level 2 Heading (Markdown '## Heading')
        elif line.startswith("## "):
            sect_text = line[3:]
            pdf.ln(4)
            pdf.set_font("helvetica", "B", 14)
            pdf.set_text_color(15, 23, 42) # Slate 900
            pdf.multi_cell(0, 8, sect_text)
            pdf.ln(2)
            
        # Level 3 Heading (Markdown '### Subheading')
        elif line.startswith("### "):
            subsect_text = line[4:]
            pdf.ln(3)
            pdf.set_font("helvetica", "B", 11)
            pdf.set_text_color(71, 85, 105) # Slate 600
            pdf.multi_cell(0, 6, subsect_text)
            pdf.ln(1)
            
        # FAQ lines
        elif line.startswith("**Q:"):
            # Clean up trailing stars if any
            clean_q = line.replace("**", "")
            pdf.ln(2)
            # Subtle light gray box for questions to make it look premium
            pdf.set_fill_color(248, 250, 252)
            pdf.set_font("helvetica", "B", 10)
            pdf.set_text_color(15, 23, 42)
            # Print with subtle border left
            pdf.multi_cell(0, 6, clean_q, fill=True)
            
        elif line.startswith("A:"):
            pdf.set_font("helvetica", "", 10)
            pdf.set_text_color(51, 65, 85) # Slate 700
            pdf.multi_cell(0, 6, line)
            pdf.ln(1)
            
        # Bullet List Items
        elif line.startswith("* ") or line.startswith("- "):
            bullet_text = line[2:]
            pdf.set_font("helvetica", "", 10)
            pdf.set_text_color(51, 65, 85)
            # Indent slightly and print bullet character
            pdf.set_x(25)
            pdf.cell(4, 6, chr(149), ln=False) # Standard bullet point
            pdf.multi_cell(0, 6, bullet_text)
            
        # Numbered List Items
        elif re.match(r"^\d+\.\s", line):
            match = re.match(r"^(\d+\.)\s(.*)", line)
            num_prefix = match.group(1)
            list_content = match.group(2)
            
            pdf.set_font("helvetica", "", 10)
            pdf.set_text_color(51, 65, 85)
            pdf.set_x(25)
            pdf.cell(8, 6, num_prefix, ln=False)
            pdf.multi_cell(0, 6, list_content)
            
        # Standard Paragraph Text
        else:
            pdf.set_font("helvetica", "", 10)
            pdf.set_text_color(51, 65, 85)
            pdf.multi_cell(0, 6, line)
            
    # Save the output PDF file
    output_filename = "AI_Assistant_Knowledge_Base.pdf"
    pdf.output(output_filename)
    print(f"Success! Beautifully formatted PDF created at: {output_filename}")

if __name__ == "__main__":
    build_pdf()
