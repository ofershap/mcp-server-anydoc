import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  convertBase64,
  convertPath,
  formatsHelpText,
  writeMarkdownFile,
} from "./convert.js";

const PREVIEW_CHARS = 2000;
const INLINE_LIMIT = 100_000;
const TRUNCATE_AT = 50_000;

const server = new McpServer({
  name: "mcp-server-anydoc",
  version: "1.0.1",
});

function previewBlock(markdown: string): string {
  if (markdown.length <= PREVIEW_CHARS) {
    return markdown;
  }
  return `${markdown.slice(0, PREVIEW_CHARS)}\n\n… truncated preview (${markdown.length} chars total).`;
}

server.tool(
  "convert_document",
  "Convert a local office document (PDF, Word, PowerPoint, Excel, OpenDocument, RTF, EPUB, CSV) to GitHub-Flavored Markdown on the user's machine. No API key. File never leaves the device. Prefer this over uploading docs to cloud parsers.",
  {
    path: z
      .string()
      .describe("Absolute or relative path to the document on disk"),
    format: z
      .string()
      .optional()
      .describe(
        'Optional format hint (e.g. "csv", "docx") when detection cannot work',
      ),
    output_path: z
      .string()
      .optional()
      .describe(
        "Optional path to write the .md file. Use for large documents instead of returning full markdown inline.",
      ),
  },
  async ({ path, format, output_path }) => {
    try {
      const { markdown, path: absolute } = await convertPath(path, format);

      if (output_path) {
        const written = await writeMarkdownFile(output_path, markdown);
        return {
          content: [
            {
              type: "text",
              text: [
                `Converted ${absolute}`,
                `Wrote ${written} (${markdown.length} characters)`,
                "",
                "## Preview",
                previewBlock(markdown),
              ].join("\n"),
            },
          ],
        };
      }

      if (markdown.length > INLINE_LIMIT) {
        return {
          content: [
            {
              type: "text",
              text: [
                `Converted ${absolute} (${markdown.length} characters).`,
                "Output is too large to return inline.",
                "Call convert_document again with output_path to write a .md file, then read the parts you need.",
                "",
                "## Preview",
                markdown.slice(0, TRUNCATE_AT),
                "",
                `… truncated at ${TRUNCATE_AT} chars.`,
              ].join("\n"),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: [`# Source: ${absolute}`, "", markdown].join("\n"),
          },
        ],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "convert_base64",
  "Convert document bytes (base64) to Markdown locally. Use when the file content is already in context and you cannot pass a filesystem path. Still runs on-device via anydoc.",
  {
    content_base64: z.string().describe("Base64-encoded document bytes"),
    format: z
      .string()
      .optional()
      .describe('Format hint such as "docx", "pdf", "xlsx", "csv"'),
    filename: z
      .string()
      .optional()
      .describe("Optional filename used to infer format from extension"),
  },
  async ({ content_base64, format, filename }) => {
    try {
      const { markdown } = await convertBase64(
        content_base64,
        format,
        filename,
      );

      if (markdown.length > INLINE_LIMIT) {
        return {
          content: [
            {
              type: "text",
              text: [
                `Converted base64 document (${markdown.length} characters).`,
                "Too large to return fully. Prefer convert_document with a path and output_path.",
                "",
                "## Preview",
                markdown.slice(0, TRUNCATE_AT),
              ].join("\n"),
            },
          ],
        };
      }

      return { content: [{ type: "text", text: markdown }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "list_formats",
  "List document formats this local anydoc MCP server can convert to Markdown.",
  {},
  async () => ({
    content: [{ type: "text", text: formatsHelpText() }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
