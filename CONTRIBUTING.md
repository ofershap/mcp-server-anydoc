# Contributing

Contributions are welcome.

## Setup

```bash
git clone https://github.com/ofershap/mcp-server-anydoc.git
cd mcp-server-anydoc
npm install
```

## Development

```bash
npm run build
npm run typecheck
npm test
npm run lint
npm run format
```

## Pull Requests

1. Fork and branch from `main`
2. Add or update tests
3. Ensure `npm run lint`, `npm run typecheck`, and `npm test` pass
4. Open a pull request

## Notes

- Conversion uses `@firecrawl/anydoc`. Keep the MCP layer thin.
- Skill + plugin manifests matter for Claude Code discovery. Run `claude plugin validate .` before shipping manifest changes.
