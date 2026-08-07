import { describe, it, expect, vi, beforeEach } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

vi.mock("@firecrawl/anydoc", () => ({
  toMarkdown: vi.fn(async (path: string) => `# mocked from ${path}`),
  toMarkdownBytes: vi.fn(
    async (_bytes: Uint8Array, format?: string) =>
      `# mocked bytes (${format ?? "auto"})`,
  ),
  formatFromExtension: vi.fn((extension: string) => {
    const name = extension.replace(/^\./, "").toLowerCase();
    const known = new Set([
      "doc",
      "docx",
      "odt",
      "pdf",
      "ppt",
      "pptx",
      "rtf",
      "epub",
      "xlsx",
      "ods",
      "odp",
      "csv",
    ]);
    return known.has(name) ? name : null;
  }),
}));

import { toMarkdown, toMarkdownBytes } from "@firecrawl/anydoc";
import { convertBase64, convertPath, formatsHelpText } from "../src/convert.js";

describe("convertPath", () => {
  const dir = join(tmpdir(), `mcp-anydoc-${process.pid}`);

  beforeEach(async () => {
    vi.clearAllMocks();
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
  });

  it("converts an existing file via toMarkdown", async () => {
    const file = join(dir, "note.docx");
    await writeFile(file, "dummy");
    const result = await convertPath(file);
    expect(result.path).toBe(file);
    expect(result.markdown).toContain("mocked from");
    expect(toMarkdown).toHaveBeenCalledWith(file);
  });

  it("errors when the file is missing", async () => {
    await expect(convertPath(join(dir, "missing.docx"))).rejects.toThrow(
      /not found or not readable/i,
    );
  });

  it("uses toMarkdownBytes when format is csv", async () => {
    const file = join(dir, "data.csv");
    await writeFile(file, "a,b\n1,2\n");
    const result = await convertPath(file, "csv");
    expect(result.markdown).toContain("csv");
    expect(toMarkdownBytes).toHaveBeenCalled();
  });
});

describe("convertBase64", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("converts base64 with explicit format", async () => {
    const content = Buffer.from("hello").toString("base64");
    const result = await convertBase64(content, "docx");
    expect(result.markdown).toContain("docx");
    expect(toMarkdownBytes).toHaveBeenCalled();
  });

  it("infers format from filename", async () => {
    const content = Buffer.from("hello").toString("base64");
    const result = await convertBase64(content, undefined, "slides.pptx");
    expect(result.markdown).toContain("pptx");
  });

  it("requires format or filename", async () => {
    const content = Buffer.from("hello").toString("base64");
    await expect(convertBase64(content)).rejects.toThrow(/needs format/i);
  });
});

describe("formatsHelpText", () => {
  it("lists common extensions", () => {
    const text = formatsHelpText();
    expect(text).toContain(".docx");
    expect(text).toContain(".pdf");
    expect(text).toContain("Not OCR");
  });
});
