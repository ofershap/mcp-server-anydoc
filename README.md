<h1 align="center">mcp-server-anydoc</h1>

<p align="center">
  <strong>Claude Code can finally read the PDF on your disk.</strong>
</p>

<p align="center">
  Local MCP + skill that turns Word, PowerPoint, Excel, PDF and more into Markdown.<br>
  No API key. The file never leaves your machine.
</p>

<p align="center">
  <a href="#quick-start-claude-code"><img src="https://img.shields.io/badge/Install_for_Claude_Code-22c55e?style=for-the-badge&logoColor=white" alt="Install for Claude Code" /></a>
  &nbsp;
  <a href="#other-clients"><img src="https://img.shields.io/badge/Cursor_/_Desktop_/_VS_Code-3b82f6?style=for-the-badge&logoColor=white" alt="Other clients" /></a>
  &nbsp;
  <a href="#tools"><img src="https://img.shields.io/badge/See_Tools-8b5cf6?style=for-the-badge&logoColor=white" alt="See Tools" /></a>
</p>

<p align="center">
  <a href="https://github.com/ofershap/mcp-server-anydoc/stargazers"><img src="https://img.shields.io/github/stars/ofershap/mcp-server-anydoc?style=social" alt="GitHub stars" /></a>
  &nbsp;
  <a href="https://www.npmjs.com/package/mcp-server-anydoc"><img src="https://img.shields.io/npm/v/mcp-server-anydoc.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/mcp-server-anydoc"><img src="https://img.shields.io/npm/dm/mcp-server-anydoc.svg" alt="npm downloads" /></a>
  <a href="https://github.com/ofershap/mcp-server-anydoc/actions/workflows/ci.yml"><img src="https://github.com/ofershap/mcp-server-anydoc/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-strict-blue" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
</p>

---

## Your Agent Meets a .docx

Claude Code is great at code. Then someone drops `Q3-plan.pptx` or `contract.pdf` into the repo and the session stalls.

Common workarounds suck:

| Workaround                  | What goes wrong                               |
| --------------------------- | --------------------------------------------- |
| Paste into chat             | Huge files, broken tables, privacy risk       |
| Upload to a cloud parse API | Leaves your machine, needs a key, costs money |
| Shell a random converter    | Fragile prompts, no structured tools          |

This package wires [anydoc](https://github.com/firecrawl/anydoc) into Claude Code as an **MCP server + skill**. Claude gets real tools (`convert_document`, `convert_base64`, `list_formats`) and a skill that teaches when to use them. Conversion is local Rust under the hood. Fast. Private.

Built for Claude Code first. Also works with Cursor, Claude Desktop, VS Code Copilot, and any MCP client.

## Quick Start (Claude Code)

### 1. Add the MCP server

```bash
claude mcp add anydoc -- npx -y mcp-server-anydoc
```

### 2. Install the skill (so Claude knows when to convert)

```bash
npx skills add ofershap/mcp-server-anydoc
```

### 3. Or install as a Claude Code plugin (MCP + skill together)

```bash
/plugin marketplace add ofershap/mcp-server-anydoc
/plugin install anydoc@ofershap-anydoc
```

Then ask Claude something like:

> Convert `./docs/proposal.docx` to Markdown and summarize the risks section.

## What's Different

|                      | Cloud parse / Firecrawl MCP parse | MarkItDown MCP    | **mcp-server-anydoc** |
| -------------------- | --------------------------------- | ----------------- | --------------------- |
| Runs on your machine | Usually uploads                   | Yes               | Yes                   |
| API key              | Required (or self-host)           | No                | No                    |
| Engine               | Hosted + OCR options              | Python MarkItDown | anydoc (Rust)         |
| Claude Code skill    | Separate / CLI skill              | Limited           | Ships in-repo         |
| Install              | `npx` + key                       | `uvx` / Python    | `npx` + skill/plugin  |

Not OCR. Scanned image-only PDFs will fail. Text-based PDFs and Office files are the sweet spot.

## Tools

| Tool               | What it does                                                   |
| ------------------ | -------------------------------------------------------------- |
| `convert_document` | Path in, Markdown out (optional `output_path` for large files) |
| `convert_base64`   | Convert bytes already in context                               |
| `list_formats`     | Supported extensions                                           |

Supported inputs include `.pdf`, `.doc` / `.docx`, `.ppt` / `.pptx`, `.xls` / `.xlsx`, OpenDocument, RTF, EPUB, CSV.

## Other Clients

<details>
<summary>Cursor</summary>

Add to `.cursor/mcp.json`:

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

</details>

<details>
<summary>Claude Desktop</summary>

Add to `claude_desktop_config.json`:

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

</details>

<details>
<summary>VS Code</summary>

Add to user settings or `.vscode/mcp.json`:

```json
{
  "mcp": {
    "servers": {
      "anydoc": {
        "command": "npx",
        "args": ["-y", "mcp-server-anydoc"]
      }
    }
  }
}
```

</details>

## Examples

- "Convert `./contracts/msa.pdf` to Markdown and list the termination clauses."
- "Turn `deck.pptx` into Markdown next to the file as `deck.md`."
- "I pasted a base64 DOCX - convert it and summarize."

## Tech Stack

|              |                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| **Runtime**  | ![Node](https://img.shields.io/badge/Node-20+-339933?logo=node.js&logoColor=white)                   |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white) |
| **Engine**   | [anydoc](https://github.com/firecrawl/anydoc) (`@firecrawl/anydoc`)                                  |
| **Protocol** | MCP stdio                                                                                            |
| **Testing**  | ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)                    |

## Development

```bash
git clone https://github.com/ofershap/mcp-server-anydoc.git
cd mcp-server-anydoc
npm install
npm test
npm run build
```

## Contributing

Contributions welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Author

[![Made by ofershap](https://gitshow.dev/api/card/ofershap)](https://gitshow.dev/ofershap)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/ofershap)

---

If this helped you, [star the repo](https://github.com/ofershap/mcp-server-anydoc), [open an issue](https://github.com/ofershap/mcp-server-anydoc/issues) if something breaks, or share it with someone who lives in Claude Code.

## License

[MIT](LICENSE) © [Ofer Shapira](https://github.com/ofershap)

Powered by [anydoc](https://github.com/firecrawl/anydoc) (MIT) from Firecrawl.
