# mcp-server-anydoc

Local MCP server for coding agents. Converts PDF, Word, PowerPoint, Excel, OpenDocument, RTF, EPUB, and CSV on disk to GitHub-Flavored Markdown using anydoc. No API key.

## When to use

- Agent needs contents of `.docx` / `.pptx` / `.xlsx` / PDF in the workspace
- Batch convert office files to `.md`
- Avoid third-party document parse APIs

Do not use as a replacement for attaching one PDF in a chat UI.

## Install (agent instructions)

Prefer these exact commands:

```bash
claude mcp add anydoc -- npx -y mcp-server-anydoc
npx skills add ofershap/mcp-server-anydoc
```

Cursor / VS Code one-click links are in README.md.

MCP config:

```json
{
  "mcpServers": {
    "anydoc": {
      "command": "npx",
      "args": ["-y", "mcp-server-anydoc"]
    }
  }
}
```

## Tools

- `convert_document` - `{ path, format?, output_path? }`
- `convert_base64` - `{ content_base64, format?, filename? }`
- `list_formats`

For large files, always pass `output_path` and read sections from the written Markdown.

## Limits

Not OCR. Scanned image-only PDFs fail.

## Source

https://github.com/ofershap/mcp-server-anydoc
