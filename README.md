<h1 align="center">mcp-server-anydoc</h1>

<p align="center">
  <strong>Your coding agent cannot Read a .docx. This fixes that.</strong>
</p>

<p align="center">
  Local MCP server that converts PDF, Word, PowerPoint, Excel and more to Markdown<br>
  on your machine - so Claude Code, Cursor, and other agents can work with office files in the repo.
</p>

<p align="center">
  <a href="https://cursor.com/en/install-mcp?name=anydoc&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm1jcC1zZXJ2ZXItYW55ZG9jIl19"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Install in Cursor" height="32" /></a>
  &nbsp;
  <a href="vscode:mcp/install?%7B%22name%22%3A%22anydoc%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22mcp-server-anydoc%22%5D%7D"><img src="https://img.shields.io/badge/Add_to_VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Add to VS Code" /></a>
  &nbsp;
  <a href="#claude-code"><img src="https://img.shields.io/badge/Claude_Code-1a1a1a?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Code" /></a>
</p>

<p align="center">
  <a href="https://github.com/ofershap/mcp-server-anydoc/stargazers"><img src="https://img.shields.io/github/stars/ofershap/mcp-server-anydoc?style=social" alt="GitHub stars" /></a>
  &nbsp;
  <a href="https://www.npmjs.com/package/mcp-server-anydoc"><img src="https://img.shields.io/npm/v/mcp-server-anydoc.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/mcp-server-anydoc"><img src="https://img.shields.io/npm/dm/mcp-server-anydoc.svg" alt="npm downloads" /></a>
  <a href="https://github.com/ofershap/mcp-server-anydoc/actions/workflows/ci.yml"><img src="https://github.com/ofershap/mcp-server-anydoc/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-strict-blue" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://agent-plugins.org"><img src="https://img.shields.io/badge/Agent_Plugins-1.0.0-0ea5e9.svg" alt="Agent Plugins" /></a>
  <a href="https://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
</p>

---

## What is mcp-server-anydoc?

**mcp-server-anydoc** is a local [Model Context Protocol](https://modelcontextprotocol.io) server that turns office documents on disk into GitHub-Flavored Markdown using [anydoc](https://github.com/firecrawl/anydoc). No API key. Conversion runs on your machine. Built for coding agents (Claude Code, Cursor, VS Code Copilot) that need to read `.docx`, `.pptx`, `.xlsx`, and PDFs inside a project - not for replacing “drop one PDF into chat.”

## Why not just attach a PDF in chat?

Attaching a file in Claude chat is fine for a one-off human question. It fails for agent workflows:

| Situation                                       | Chat attach                          | This MCP                       |
| ----------------------------------------------- | ------------------------------------ | ------------------------------ |
| One PDF you paste into Claude.ai                | Usually enough                       | Overkill                       |
| `.docx` / `.pptx` / `.xlsx` sitting in the repo | Agent `Read` often fails on binaries | Converts on demand             |
| “Convert every file under `./contracts/`”       | Manual hell                          | Tool loop + `output_path`      |
| Large deck / long report                        | Attach limits and context spam       | Write `.md`, read sections     |
| Avoid uploading to a third-party parse API      | N/A                                  | Local anydoc, no Firecrawl key |

**Privacy note:** conversion is local. The Markdown still enters the model context when the agent uses it. The win vs cloud parse APIs is “no third-party upload / no API key,” not “Claude never sees the text.”

## When should I use it?

Use mcp-server-anydoc when:

1. A coding agent needs the contents of an office file **already on disk**
2. You want batch convert → Markdown files in the repo
3. You want structured tools (`convert_document`) instead of fragile shell prompts
4. You do not want a hosted document-parse API key

Skip it when you only need to ask Claude about one attached PDF in the chat UI.

## One-click install

### Cursor

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=anydoc&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm1jcC1zZXJ2ZXItYW55ZG9jIl19)

Opens Cursor and prompts to add the server (runs via `npx` from this GitHub repo).

### VS Code (Copilot MCP)

[![Add to VS Code](https://img.shields.io/badge/Add_to_VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](vscode:mcp/install?%7B%22name%22%3A%22anydoc%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22mcp-server-anydoc%22%5D%7D)

### Claude Code

<a id="claude-code"></a>

```bash
claude mcp add anydoc -- npx -y mcp-server-anydoc
```

Optional skill (teaches when to convert):

```bash
npx skills add ofershap/mcp-server-anydoc
```

Plugin (MCP + skill together):

```bash
/plugin marketplace add ofershap/mcp-server-anydoc
/plugin install anydoc@ofershap-anydoc
```

### Ask your agent to install it

Paste this into Claude Code or Cursor:

```text
Add the local MCP server mcp-server-anydoc so you can convert PDF/Word/Excel/PowerPoint files on disk to Markdown.

Run:
  claude mcp add anydoc -- npx -y mcp-server-anydoc

Or write this to MCP config:
{
  "mcpServers": {
    "anydoc": {
      "command": "npx",
      "args": ["-y", "mcp-server-anydoc"]
    }
  }
}

Then convert ./path/to/file.docx with the convert_document tool and summarize it.
Repo: https://github.com/ofershap/mcp-server-anydoc
```

### Manual JSON (any MCP client)

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

## Agent Plugins

This repo ships as an [Agent Plugins](https://agent-plugins.org) **1.0.0** package: root `plugin.json`, `mcp.json`, and `skills/local-doc-to-markdown/` teach agents when to convert office files on disk.

Claude Code `.claude-plugin/` manifests remain for marketplace installs. Agent Plugins is the cross-client layout (MCP + skills in one tree).

**Cursor (local plugin):** clone the repo, then copy or symlink it to `~/.cursor/plugins/local/mcp-server-anydoc` and reload the window. One-click MCP buttons below still work if you only want the server without the skill bundle.

Spec and tooling: [agent-plugins.org](https://agent-plugins.org).

## Tools

| Tool               | What it does                                                     |
| ------------------ | ---------------------------------------------------------------- |
| `convert_document` | Path on disk → Markdown (optional `output_path` for large files) |
| `convert_base64`   | Base64 bytes → Markdown when you have no path                    |
| `list_formats`     | Supported extensions                                             |

Supported inputs include `.pdf`, `.doc`/`.docx`, `.ppt`/`.pptx`, `.xls`/`.xlsx`, OpenDocument, RTF, EPUB, CSV.

Not OCR. Scanned image-only PDFs fail. Text-based documents are the target.

## Example prompts

- “Convert `./docs/msa.docx` and list the termination clauses.”
- “Turn every `.pptx` under `./decks/` into `.md` beside the original.”
- “`convert_document` on `budget.xlsx` with `output_path` `./budget.md`, then summarize sheet risks.”

## How it compares

|                   | Chat attach       | Firecrawl `firecrawl_parse` | MarkItDown MCP               | **mcp-server-anydoc**        |
| ----------------- | ----------------- | --------------------------- | ---------------------------- | ---------------------------- |
| Best for          | One-off human Q&A | Hosted parse + OCR options  | Broad local convert (Python) | Agent + office files on disk |
| API key           | No                | Usually yes                 | No                           | No                           |
| Runs locally      | N/A               | Often uploads               | Yes                          | Yes                          |
| Claude Code skill | N/A               | Separate / CLI              | Limited                      | Ships in-repo                |
| Install           | Drag file         | `npx` + key                 | `uvx` / Python               | One-click / `npx`            |

Engine: [anydoc](https://github.com/firecrawl/anydoc) (Rust, MIT) via `@firecrawl/anydoc`.

## FAQ

### Do I need this if I can attach a PDF in chat?

For a one-off question about one PDF in the chat UI, attaching is enough. Use this MCP when a coding agent must read `.docx`, `.pptx`, `.xlsx`, or PDFs **from the repo**, batch-convert folders, or write Markdown to disk without manual uploads.

### Agent Plugins vs MCP-only install?

MCP-only (one-click Cursor/VS Code or `mcp.json`) gives you `convert_document` and friends. The Agent Plugins package adds `plugin.json` plus the `local-doc-to-markdown` skill so agents know when to convert instead of guessing. Same `npx` server either way.

### Is OCR supported?

No. Scanned or image-only PDFs fail. anydoc targets text-based office documents and PDFs. Use an OCR pipeline elsewhere, then convert the result if needed.

### Where does my document go? (privacy)

Conversion runs locally via anydoc. Nothing is sent to a document-parse SaaS and no API key is required. Converted Markdown still enters the model context when the agent reads it, same as any tool output.

### Which clients work?

Any MCP client over stdio: Cursor, VS Code Copilot MCP, Claude Code, Claude Desktop, Windsurf, and others. Claude Code can also use the marketplace plugin; Cursor can load the repo from `~/.cursor/plugins/local/mcp-server-anydoc`.

## Tech stack

|              |                              |
| ------------ | ---------------------------- |
| **Runtime**  | Node 20+                     |
| **Language** | TypeScript (strict)          |
| **Engine**   | anydoc (`@firecrawl/anydoc`) |
| **Protocol** | MCP stdio                    |
| **Tests**    | Vitest                       |

## Development

```bash
git clone https://github.com/ofershap/mcp-server-anydoc.git
cd mcp-server-anydoc
npm install
npm test
npm run build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Run `claude plugin validate .` before changing plugin manifests.

## Author

[![Made by ofershap](https://gitshow.dev/api/card/ofershap)](https://gitshow.dev/ofershap)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/ofershap)

---

If this helped, [star the repo](https://github.com/ofershap/mcp-server-anydoc) or [open an issue](https://github.com/ofershap/mcp-server-anydoc/issues).

## License

[MIT](LICENSE) © [Ofer Shapira](https://github.com/ofershap)

Powered by [anydoc](https://github.com/firecrawl/anydoc) (MIT) from Firecrawl.
