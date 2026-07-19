import os
import sys
import subprocess

def install_and_import():
    try:
        import markdown
        from xhtml2pdf import pisa
    except ImportError:
        print("Installing required PDF compilation libraries (markdown, xhtml2pdf==0.2.15)...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "markdown", "xhtml2pdf==0.2.15"])
        import markdown
        from xhtml2pdf import pisa
    return markdown, pisa

def main():
    markdown_lib, pisa_lib = install_and_import()

    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    md_path = os.path.join(root_dir, "PROJECT_REPORT.md")
    pdf_path = os.path.join(root_dir, "PROJECT_REPORT.pdf")

    if not os.path.exists(md_path):
        print(f"Error: PROJECT_REPORT.md not found at {md_path}")
        sys.exit(1)

    print("Reading PROJECT_REPORT.md...")
    with open(md_path, "r", encoding="utf-8") as f:
        md_content = f.read()

    # Pre-process MD content to clean up Mermaid blocks for static PDF styling
    lines = md_content.split("\n")
    cleaned_lines = []
    in_mermaid = False
    for line in lines:
        if line.strip().startswith("```mermaid"):
            in_mermaid = True
            cleaned_lines.append('<div class="diagram-placeholder">')
            continue
        elif in_mermaid and line.strip() == "```":
            in_mermaid = False
            cleaned_lines.append('</div>')
            continue
        cleaned_lines.append(line)
    
    cleaned_md = "\n".join(cleaned_lines)

    print("Converting Markdown to HTML...")
    # Enable tables extension for markdown parsing
    html_content = markdown_lib.markdown(cleaned_md, extensions=['tables'])

    # Premium CSS PDF template
    styled_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            @page {{
                size: a4;
                margin: 2cm;
            }}
            body {{
                font-family: Helvetica, Arial, sans-serif;
                color: #2D3748;
                font-size: 10pt;
                line-height: 1.6;
            }}
            h1 {{
                font-size: 24pt;
                color: #1A365D;
                text-align: center;
                margin-bottom: 20px;
                -pdf-keep-with-next: true;
            }}
            h2 {{
                font-size: 16pt;
                color: #2B6CB0;
                border-bottom: 1px solid #E2E8F0;
                padding-bottom: 5px;
                margin-top: 30px;
                margin-bottom: 15px;
                -pdf-keep-with-next: true;
            }}
            h3 {{
                font-size: 12pt;
                color: #2D3748;
                margin-top: 20px;
                margin-bottom: 10px;
                -pdf-keep-with-next: true;
            }}
            p {{
                margin-bottom: 12px;
            }}
            ul, ol {{
                margin-bottom: 15px;
                padding-left: 20px;
            }}
            li {{
                margin-bottom: 5px;
            }}
            hr {{
                border: 0;
                border-top: 1px solid #E2E8F0;
                margin: 30px 0;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                -pdf-keep-with-next: true;
            }}
            th {{
                background-color: #F7FAFC;
                color: #2D3748;
                font-weight: bold;
                border: 1px solid #E2E8F0;
                padding: 8px;
                text-align: left;
            }}
            td {{
                border: 1px solid #E2E8F0;
                padding: 8px;
            }}
            .diagram-placeholder {{
                background-color: #F8FAFC;
                border: 1px dashed #CBD5E1;
                border-radius: 4px;
                padding: 15px;
                font-family: monospace;
                font-size: 9pt;
                color: #475569;
                margin: 15px 0;
                white-space: pre;
            }}
            .footer {{
                text-align: center;
                font-size: 8pt;
                color: #A0AEC0;
            }}
        </style>
    </head>
    <body>
        <div class="header-logo" style="text-align: center; margin-bottom: 30px;">
            <span style="font-size: 12pt; font-weight: bold; color: #718096; letter-spacing: 2px;">FULL STACK DEVELOPMENT WITH MERN</span>
        </div>
        
        {html_content}
        
        <pdf:nextpage />
    </body>
    </html>
    """

    print("Compiling PDF...")
    with open(pdf_path, "w+b") as result_file:
        pisa_status = pisa_lib.CreatePDF(styled_html, dest=result_file)

    if not pisa_status.err:
        print(f"SUCCESS: PDF created at {pdf_path}")
    else:
        print("Error compiling PDF.")
        sys.exit(1)

if __name__ == "__main__":
    main()
