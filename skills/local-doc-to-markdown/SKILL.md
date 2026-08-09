---
name: local-doc-to-markdown
description: Convert local PDF, Word (.doc/.docx), PowerPoint (.ppt/.pptx), Excel (.xls/.xlsx), OpenDocument, RTF, EPUB, and CSV to GitHub-Flavored Markdown via the anydoc MCP server. Triggers include convert pdf to markdown, read docx, powerpoint to md, excel to markdown, office files in repo, and local document convert without API key. Use when an agent needs on-disk office files, batch repo conversion, or structured tools instead of chat attachments or hosted parse APIs. Prefer MCP over shelling out to CLI converters when this server is connected.
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

## Defaults

- Tool choice: `convert_document` with an absolute path.
- Large files: set `output_path` and read slices from the written `.md`.
- Unknown extension: call `list_formats` or pass explicit `format`.

## Error scenarios

| Symptom                          | Action                                                                      |
| -------------------------------- | --------------------------------------------------------------------------- |
| Scanned or image-only PDF        | Tell the user OCR is not supported here; suggest an OCR pipeline elsewhere. |
| Unknown or unsupported extension | `list_formats`; fix path or pass `format`.                                  |
| `convert_base64` without format  | Require `format` or a filename with a known extension.                      |
| MCP server not connected         | Ask the user to add `mcp-server-anydoc` to MCP config, then retry.          |

## Rules

- Prefer MCP tools over `npx @firecrawl/anydoc` shell-outs when this server is connected.
- Never claim the file left the machine. Conversion is local.
- Do not invent OCR, image extraction, or edit-in-place features.
