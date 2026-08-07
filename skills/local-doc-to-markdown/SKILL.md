---
name: local-doc-to-markdown
description: Convert local PDF, Word (.doc/.docx), PowerPoint (.ppt/.pptx), Excel (.xls/.xlsx), OpenDocument, RTF, EPUB, CSV files to GitHub-Flavored Markdown via the anydoc MCP server. Use when Claude Code needs the contents of an office document, spreadsheet, presentation, ebook, or PDF on the user's machine without uploading files or using an API key. Prefer these MCP tools over shelling out to CLI converters.
license: MIT
metadata:
  author: ofershap
---

# Local documents to Markdown (MCP)

Use the **anydoc** MCP tools. Conversion runs on the user's machine. No API key. Do not upload the file to a hosted parse API unless the user asks.

## Tools

| Tool               | When to use                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `convert_document` | You have a filesystem path to a PDF/Office file                    |
| `convert_base64`   | You only have file bytes in context (needs `format` or `filename`) |
| `list_formats`     | Confirm supported extensions                                       |

## Workflow

1. Prefer `convert_document` with an absolute path when possible.
2. For large documents, pass `output_path` (e.g. `./report.md`) and read only the sections you need.
3. Use `format` only for CSV or when the extension is missing/wrong.
4. If conversion fails on a scanned PDF, say OCR is required. This server is not OCR.

## Rules

- Prefer MCP tools over `npx @firecrawl/anydoc` shell-outs when this server is connected.
- Never claim the file left the machine. Conversion is local.
- Do not invent OCR, image extraction, or edit-in-place features.
