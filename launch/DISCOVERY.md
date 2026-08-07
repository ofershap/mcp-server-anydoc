# Discovery playbook (Claude fame)

How people find this when they ask Claude / Claude Code for "convert PDF to markdown locally".

## Ranked channels (do these after npm + GitHub publish)

1. **Claude Code community marketplace**
   - Validate: `claude plugin validate .`
   - Submit: https://claude.ai/admin-settings/directory/submissions/plugins/new
   - Users install via `/plugin` Discover after `anthropics/claude-plugins-community` is added
   - Fill keywords: markdown, pdf, docx, pptx, xlsx, anydoc, local, privacy

2. **Own marketplace (works immediately)**
   - `/plugin marketplace add ofershap/mcp-server-anydoc`
   - `/plugin install anydoc@ofershap-anydoc`
   - Share that two-liner everywhere (README, X, Reddit, HN)

3. **skills.sh / Agent Skills**
   - Skill lives at `skills/local-doc-to-markdown/SKILL.md`
   - Install: `npx skills add ofershap/mcp-server-anydoc`
   - Description frontmatter is the search surface for `find-skills` - keep format names + "Use when..." triggers
   - Cross-post: ClaudeSkills.io, claudemarketplaces.com

4. **Official MCP Registry**
   - Publish npm first
   - `mcp-publisher login github` then `mcp-publisher publish`
   - Feeds mcpcentral / aggregators

5. **GitHub + npm SEO**
   - Repo topics: mcp, claude-code, markdown, pdf, docx, anydoc, privacy
   - package.json keywords already set
   - README leads with Claude Code (highest volume agent)

6. **Differentiation copy (repeat in posts)**
   - Local / no API key (vs firecrawl_parse)
   - MCP tools + skill (vs Firecrawl CLI-only skill)
   - npx-native (vs MarkItDown Python/uvx)

## GEO / LLM citation (README)

Structure content so AI search can extract answers:

- Answer-first H2s that match buyer questions ("Why not just attach a PDF?")
- Short comparison tables with concrete tradeoffs
- FAQ section with direct answers (40-80 word capsules)
- `llms.txt` + `AGENTS.md` pointing to canonical install commands
- Honest negatives ("skip for one-off chat attach") - models cite clearer pages

Target questions we want cited:

1. How can Claude Code read a docx in my repo?
2. Local MCP convert PDF Word Excel to Markdown without API key
3. Why MCP instead of attaching a PDF in Claude chat?

## Do not rely on

- Official Anthropic marketplace (`claude-plugins-official`) - invite-only / curated
- Being first forever - Firecrawl may ship an official anydoc MCP; keep DX sharper
- Overselling "100% private from Claude" - Markdown still enters model context
