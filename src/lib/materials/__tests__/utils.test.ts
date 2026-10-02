import { describe, expect, it } from "vitest";
import { getMaterialFileType, formatFileSize } from "../types";
import { isSupportedFile, validateFile, canPreview } from "../utils";

describe("material types", () => {
  it("detects pdf type", () => {
    expect(getMaterialFileType("application/pdf", "test.pdf")).toBe("pdf");
  });

  it("detects docx type", () => {
    expect(
      getMaterialFileType(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "doc.docx",
      ),
    ).toBe("docx");
  });

  it("detects txt type", () => {
    expect(getMaterialFileType("text/plain", "read.txt")).toBe("txt");
  });

  it("detects markdown type", () => {
    expect(getMaterialFileType("text/markdown", "notes.md")).toBe("md");
  });

  it("detects image type", () => {
    expect(getMaterialFileType("image/png", "pic.png")).toBe("image");
  });

  it("formats file size", () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1048576)).toBe("1 MB");
  });
});

describe("validation", () => {
  it("validates supported pdf", () => {
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    expect(isSupportedFile(file)).toBe(true);
    expect(validateFile(file).valid).toBe(true);
  });

  it("rejects unsupported type", () => {
    const file = new File(["test"], "test.exe", { type: "application/exe" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
  });

  it("checks preview capability", () => {
    expect(canPreview("pdf")).toBe(true);
    expect(canPreview("txt")).toBe(true);
    expect(canPreview("md")).toBe(true);
    expect(canPreview("image")).toBe(true);
    expect(canPreview("docx")).toBe(false);
  });
});
