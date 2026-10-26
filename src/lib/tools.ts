import type { LucideIcon } from "lucide-react";
import {
  ArchiveRestore,
  Bot,
  Combine,
  Crop,
  FileArchive,
  FileCheck2,
  FileCog,
  FileImage,
  FileOutput,
  FilePenLine,
  FilePlus2,
  FileScan,
  FileSpreadsheet,
  FileText,
  Files,
  FormInput,
  Globe2,
  Image,
  Languages,
  LockKeyhole,
  MessageSquareText,
  Minimize2,
  PanelTop,
  Presentation,
  RotateCw,
  ScanLine,
  Scissors,
  ShieldCheck,
  Signature,
  Sparkles,
  Table2,
  TextCursorInput,
  WandSparkles,
} from "lucide-react";

export type ToolCategory = "Convert" | "Edit & Organize" | "Optimize" | "Secure" | "AI & Extract";

export type PdfTool = {
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  longDescription: string;
  category: ToolCategory;
  icon: LucideIcon;
  accent: string;
  popular?: boolean;
  new?: boolean;
  accepts: string;
  action: string;
};

const common = {
  accent: "blue",
  longDescription: "Process your documents securely in your browser and cloud workspace. Files are encrypted in transit and automatically removed from temporary processing after one hour.",
  accepts: ".pdf",
  action: "Choose files",
} as const;

export const tools: PdfTool[] = [
  { ...common, slug: "pdf-to-word", name: "PDF to Word", description: "Convert PDFs into editable DOCX files with accurate formatting.", category: "Convert", icon: FileText, accent: "blue", popular: true },
  { ...common, slug: "pdf-to-excel", name: "PDF to Excel", description: "Turn PDF tables into editable Excel spreadsheets.", category: "Convert", icon: FileSpreadsheet, accent: "green" },
  { ...common, slug: "pdf-to-powerpoint", name: "PDF to PowerPoint", description: "Create editable slides from any PDF presentation.", category: "Convert", icon: Presentation, accent: "orange" },
  { ...common, slug: "pdf-to-jpg", name: "PDF to JPG", description: "Export PDF pages as crisp, high-resolution images.", category: "Convert", icon: FileImage, accent: "violet", popular: true },
  { ...common, slug: "pdf-to-png", name: "PDF to PNG", description: "Convert pages to transparent, high-quality PNG files.", category: "Convert", icon: Image, accent: "cyan" },
  { ...common, slug: "pdf-to-text", name: "PDF to Text", description: "Extract clean text from digital and scanned PDFs.", category: "Convert", icon: TextCursorInput, accent: "slate" },
  { ...common, slug: "word-to-pdf", name: "Word to PDF", description: "Convert DOC and DOCX documents into polished PDFs.", category: "Convert", icon: FileOutput, accent: "blue", accepts: ".doc,.docx", popular: true },
  { ...common, slug: "excel-to-pdf", name: "Excel to PDF", description: "Convert spreadsheets to shareable, print-ready PDFs.", category: "Convert", icon: FileSpreadsheet, accent: "green", accepts: ".xls,.xlsx" },
  { ...common, slug: "powerpoint-to-pdf", name: "PowerPoint to PDF", description: "Preserve every slide while creating a compact PDF.", category: "Convert", icon: Presentation, accent: "orange", accepts: ".ppt,.pptx" },
  { ...common, slug: "jpg-to-pdf", name: "JPG to PDF", description: "Combine JPG images into one beautifully ordered PDF.", category: "Convert", icon: FileImage, accent: "violet", accepts: ".jpg,.jpeg", action: "Choose images" },
  { ...common, slug: "html-to-pdf", name: "HTML to PDF", description: "Turn web pages and HTML files into pixel-perfect PDFs.", category: "Convert", icon: Globe2, accent: "cyan", accepts: ".html,.htm" },
  { ...common, slug: "epub-to-pdf", name: "EPUB to PDF", description: "Convert eBooks to an accessible universal PDF.", category: "Convert", icon: FileArchive, accent: "pink", accepts: ".epub" },
  { ...common, slug: "edit-pdf", name: "Edit PDF", description: "Edit text, images, links, and annotations with ease.", category: "Edit & Organize", icon: FilePenLine, accent: "indigo", popular: true },
  { ...common, slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs in the exact order you need.", category: "Edit & Organize", icon: Combine, accent: "purple", accepts: ".pdf", action: "Choose PDFs" },
  { ...common, slug: "split-pdf", name: "Split PDF", description: "Separate pages or page ranges into individual files.", category: "Edit & Organize", icon: Scissors, accent: "rose" },
  { ...common, slug: "organize-pdf", name: "Organize PDF", description: "Reorder, rotate, duplicate, or remove pages visually.", category: "Edit & Organize", icon: Files, accent: "blue" },
  { ...common, slug: "rotate-pdf", name: "Rotate PDF", description: "Rotate one page or every page in a few clicks.", category: "Edit & Organize", icon: RotateCw, accent: "cyan" },
  { ...common, slug: "crop-pdf", name: "Crop PDF", description: "Crop page margins and resize your PDF canvas.", category: "Edit & Organize", icon: Crop, accent: "amber" },
  { ...common, slug: "page-numbers", name: "Page Numbers", description: "Add flexible, professional page numbering.", category: "Edit & Organize", icon: PanelTop, accent: "slate" },
  { ...common, slug: "create-pdf", name: "Create PDF", description: "Start blank or create a PDF from almost any file.", category: "Edit & Organize", icon: FilePlus2, accent: "emerald", accepts: "*" },
  { ...common, slug: "fill-pdf", name: "Fill PDF Forms", description: "Complete, create, and sign interactive PDF forms.", category: "Edit & Organize", icon: FormInput, accent: "violet" },
  { ...common, slug: "compress-pdf", name: "Compress PDF", description: "Reduce file size without a visible quality loss.", category: "Optimize", icon: Minimize2, accent: "pink", popular: true },
  { ...common, slug: "optimize-pdf", name: "Optimize PDF", description: "Optimize documents for web, mobile, or print.", category: "Optimize", icon: WandSparkles, accent: "blue" },
  { ...common, slug: "repair-pdf", name: "Repair PDF", description: "Recover content from damaged or corrupted PDFs.", category: "Optimize", icon: ArchiveRestore, accent: "orange" },
  { ...common, slug: "batch-process", name: "Batch Processing", description: "Convert, compress, or rename hundreds of files.", category: "Optimize", icon: FileCog, accent: "indigo", new: true, accepts: "*" },
  { ...common, slug: "protect-pdf", name: "Protect PDF", description: "Encrypt PDFs and control editing, copying, and print.", category: "Secure", icon: LockKeyhole, accent: "amber", popular: true },
  { ...common, slug: "unlock-pdf", name: "Unlock PDF", description: "Remove a known password from your protected PDF.", category: "Secure", icon: ShieldCheck, accent: "emerald" },
  { ...common, slug: "sign-pdf", name: "Sign PDF", description: "Create, request, and track legally binding signatures.", category: "Secure", icon: Signature, accent: "blue", popular: true },
  { ...common, slug: "sanitize-pdf", name: "Sanitize PDF", description: "Permanently remove hidden data and metadata.", category: "Secure", icon: FileCheck2, accent: "slate" },
  { ...common, slug: "ocr-pdf", name: "OCR PDF", description: "Make scans searchable and editable in 40+ languages.", category: "AI & Extract", icon: ScanLine, accent: "violet", popular: true },
  { ...common, slug: "chat-with-pdf", name: "Chat with PDF", description: "Ask questions and get answers with page citations.", category: "AI & Extract", icon: Bot, accent: "blue", new: true, popular: true },
  { ...common, slug: "summarize-pdf", name: "Summarize PDF", description: "Turn long documents into clear, reliable summaries.", category: "AI & Extract", icon: Sparkles, accent: "purple", new: true },
  { ...common, slug: "translate-pdf", name: "Translate PDF", description: "Translate documents while preserving their layout.", category: "AI & Extract", icon: Languages, accent: "cyan", new: true },
  { ...common, slug: "extract-text", name: "Extract Text", description: "Export clean text while preserving reading order.", category: "AI & Extract", icon: MessageSquareText, accent: "slate" },
  { ...common, slug: "extract-images", name: "Extract Images", description: "Download every embedded image at original quality.", category: "AI & Extract", icon: Image, accent: "rose" },
  { ...common, slug: "extract-tables", name: "Extract Tables", description: "Detect tables and export structured spreadsheet data.", category: "AI & Extract", icon: Table2, accent: "green" },
  { ...common, slug: "scan-to-pdf", name: "Scan to PDF", description: "Auto-crop, enhance, and combine camera scans.", category: "AI & Extract", icon: FileScan, accent: "orange", accepts: "image/*", action: "Choose scans" },
];

export const categories: ToolCategory[] = ["Convert", "Edit & Organize", "Optimize", "Secure", "AI & Extract"];
export const popularTools = tools.filter((tool) => tool.popular);
export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
