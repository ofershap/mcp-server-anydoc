import { readFile, writeFile, access } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { constants as fsConstants } from "node:fs";
import {
  formatFromExtension,
  toMarkdown,
  toMarkdownBytes,
  type Format,
} from "@firecrawl/anydoc";

export const SUPPORTED_EXTENSIONS = [
  ".doc",
  ".docx",
  ".docm",
  ".odt",
  ".rtf",
  ".epub",
  ".pdf",
  ".ppt",
  ".pps",
  ".pot",
  ".pptx",
  ".pptm",
  ".ppsx",
  ".ppsm",
  ".odp",
  ".xls",
  ".xlsx",
  ".xlsm",
  ".xlsb",
  ".ods",
  ".csv",
] as const;

function resolveFormat(name: string): Format {
  const format = formatFromExtension(name);
  if (format == null) {
    throw new Error(
      `Unknown format "${name}". Use list_formats for supported values.`,
    );
  }
  return format;
}

function formatError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/ocr|scanned|image-only|unsupported/i.test(message)) {
    return `${message} Scanned or image-only PDFs need OCR; this server does not do OCR.`;
  }
  return message;
}

async function assertReadable(path: string): Promise<void> {
  try {
    await access(path, fsConstants.R_OK);
  } catch {
    throw new Error(
      `File not found or not readable: ${path}. Pass an absolute path or a path relative to the current working directory.`,
    );
  }
}

export async function convertPath(
  path: string,
  format?: string,
): Promise<{ markdown: string; path: string }> {
  const absolute = resolve(path);
  await assertReadable(absolute);

  const normalizedFormat = format?.trim().toLowerCase();

  try {
    const needsExplicitFormat =
      normalizedFormat === "csv" ||
      (normalizedFormat !== undefined &&
        extname(absolute).toLowerCase() !== `.${normalizedFormat}`);

    if (needsExplicitFormat && normalizedFormat) {
      const bytes = new Uint8Array(await readFile(absolute));
      const markdown = await toMarkdownBytes(
        bytes,
        resolveFormat(normalizedFormat),
      );
      return { markdown, path: absolute };
    }

    const markdown = await toMarkdown(absolute);
    return { markdown, path: absolute };
  } catch (err) {
    throw new Error(formatError(err));
  }
}

export async function convertBase64(
  contentBase64: string,
  format?: string,
  filename?: string,
): Promise<{ markdown: string }> {
  const normalizedFormat = format?.trim().toLowerCase();
  const fromName = filename
    ? extname(filename).replace(/^\./, "").toLowerCase()
    : undefined;
  const resolvedFormat = normalizedFormat || fromName;

  if (!resolvedFormat) {
    throw new Error(
      'convert_base64 needs format or filename with an extension (e.g. format: "docx" or filename: "report.docx").',
    );
  }

  try {
    const bytes = new Uint8Array(Buffer.from(contentBase64, "base64"));
    if (bytes.byteLength === 0) {
      throw new Error("Decoded base64 content is empty.");
    }
    const markdown = await toMarkdownBytes(
      bytes,
      resolveFormat(resolvedFormat),
    );
    return { markdown };
  } catch (err) {
    throw new Error(formatError(err));
  }
}

export async function writeMarkdownFile(
  outputPath: string,
  markdown: string,
): Promise<string> {
  const absolute = resolve(outputPath);
  await writeFile(absolute, markdown, "utf8");
  return absolute;
}

export function formatsHelpText(): string {
  return [
    "Supported extensions (local conversion via anydoc, no API key):",
    SUPPORTED_EXTENSIONS.join(", "),
    "",
    "Pass format only when auto-detect cannot work (CSV) or the extension is wrong/missing.",
    "Not OCR: scanned or image-only PDFs will fail.",
  ].join("\n");
}
