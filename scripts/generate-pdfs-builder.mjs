import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourcesDir = path.resolve(__dirname, "..", "public", "sources");

function escapePdf(str) {
  return str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/**
 * Builds a multi-page PDF document with professional headers, footers, rules, and typography.
 */
export function buildMultiPagePdf({ title, subtitle, organization, docRef, url, sections }) {
  // Flatten sections into styled lines
  // Each line: { text, type: 'title' | 'h1' | 'h2' | 'body' | 'bullet' | 'table_header' | 'table_row' | 'callout' | 'blank' }
  const rawLines = [];

  rawLines.push({ text: organization.toUpperCase(), type: 'meta_org' });
  rawLines.push({ text: title, type: 'title' });
  if (subtitle) rawLines.push({ text: subtitle, type: 'subtitle' });
  rawLines.push({ text: `Official Reference: ${docRef}`, type: 'meta' });
  rawLines.push({ text: `Official Web Portal: ${url}`, type: 'meta' });
  rawLines.push({ text: "================================================================================", type: 'rule' });
  rawLines.push({ text: "", type: 'blank' });

  for (const sec of sections) {
    rawLines.push({ text: sec.heading, type: 'h1' });
    rawLines.push({ text: "--------------------------------------------------------------------------------", type: 'rule_light' });
    for (const item of sec.items) {
      if (typeof item === 'string') {
        if (item.startsWith("### ")) {
          rawLines.push({ text: item.replace("### ", ""), type: 'h2' });
        } else if (item.startsWith("- ")) {
          rawLines.push({ text: `  * ${item.replace("- ", "")}`, type: 'bullet' });
        } else if (item.startsWith("|")) {
          rawLines.push({ text: item, type: 'table' });
        } else {
          rawLines.push({ text: item, type: 'body' });
        }
      }
    }
    rawLines.push({ text: "", type: 'blank' });
  }

  // Paginate lines into pages (~42 lines per page)
  const LINES_PER_PAGE = 42;
  const pages = [];
  let currentPage = [];

  for (const line of rawLines) {
    if (currentPage.length >= LINES_PER_PAGE) {
      pages.push(currentPage);
      currentPage = [];
    }
    currentPage.push(line);
  }
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  const totalPages = pages.length;

  // Build PDF Objects
  // 1: Catalog
  // 2: Pages
  // 3: Font F1 (Helvetica)
  // 4: Font F2 (Helvetica-Bold)
  // 5: Font F3 (Helvetica-Oblique)
  // Page objects: 6, 8, 10...
  // Stream objects: 7, 9, 11...

  const objects = [];
  const pageObjectIds = [];

  const fontF1Id = 3;
  const fontF2Id = 4;
  const fontF3Id = 5;

  let nextObjId = 6;
  const pageStreamPairs = [];

  for (let p = 0; p < totalPages; p++) {
    const pageObjId = nextObjId++;
    const streamObjId = nextObjId++;
    pageObjectIds.push(pageObjId);
    pageStreamPairs.push({ pageObjId, streamObjId, lines: pages[p], pageNum: p + 1 });
  }

  // Object 1: Catalog
  objects.push({
    id: 1,
    content: `<< /Type /Catalog /Pages 2 0 R >>`
  });

  // Object 2: Pages
  objects.push({
    id: 2,
    content: `<< /Type /Pages /Kids [${pageObjectIds.map(id => `${id} 0 R`).join(" ")}] /Count ${totalPages} >>`
  });

  // Object 3: Font F1 (Helvetica Regular)
  objects.push({
    id: fontF1Id,
    content: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`
  });

  // Object 4: Font F2 (Helvetica Bold)
  objects.push({
    id: fontF2Id,
    content: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`
  });

  // Object 5: Font F3 (Helvetica Oblique)
  objects.push({
    id: fontF3Id,
    content: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>`
  });

  // Generate Page and Stream objects
  for (const pair of pageStreamPairs) {
    // Build page stream content
    let stream = "";

    // Header banner on top
    stream += `q 0.1 0.2 0.5 rg 40 760 532 20 re f Q\n`;
    stream += `BT\n/F2 9 Tf\n1 1 1 rg\n50 766 Td\n(${escapePdf(organization.toUpperCase())} - CLINICAL KNOWLEDGE REPOSITORY) Tj\nET\n`;
    stream += `BT\n/F1 8 Tf\n1 1 1 rg\n480 766 Td\n(VERIFIED SOURCE) Tj\nET\n`;

    // Footer on bottom
    stream += `q 0.8 0.85 0.9 rg 40 38 532 1 re f Q\n`;
    stream += `BT\n/F3 8 Tf\n0.3 0.3 0.3 rg\n50 26 Td\n(Hypertension AI Assistant - Academic & Clinical Judging Documentation) Tj\nET\n`;
    stream += `BT\n/F2 8 Tf\n0.2 0.2 0.2 rg\n500 26 Td\n(Page ${pair.pageNum} of ${totalPages}) Tj\nET\n`;

    // Render lines
    let y = 735;
    for (const item of pair.lines) {
      const text = escapePdf(item.text.substring(0, 110));
      if (item.type === 'blank') {
        y -= 10;
        continue;
      }
      if (item.type === 'rule' || item.type === 'rule_light') {
        stream += `q 0.7 0.75 0.8 rg 45 ${y + 2} 522 0.75 re f Q\n`;
        y -= 12;
        continue;
      }

      if (item.type === 'meta_org') {
        stream += `BT\n/F2 10 Tf\n0.1 0.3 0.7 rg\n50 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 14;
      } else if (item.type === 'title') {
        stream += `BT\n/F2 14 Tf\n0.05 0.1 0.25 rg\n50 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 18;
      } else if (item.type === 'subtitle') {
        stream += `BT\n/F3 9.5 Tf\n0.2 0.3 0.4 rg\n50 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 13;
      } else if (item.type === 'meta') {
        stream += `BT\n/F1 8.5 Tf\n0.35 0.4 0.45 rg\n50 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 12;
      } else if (item.type === 'h1') {
        y -= 4;
        stream += `BT\n/F2 11 Tf\n0.1 0.25 0.55 rg\n50 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 15;
      } else if (item.type === 'h2') {
        stream += `BT\n/F2 9.5 Tf\n0.15 0.2 0.3 rg\n50 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 13;
      } else if (item.type === 'bullet') {
        stream += `BT\n/F1 9 Tf\n0.1 0.1 0.15 rg\n55 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 13;
      } else if (item.type === 'table') {
        stream += `BT\n/F1 8.5 Tf\n0.05 0.1 0.15 rg\n50 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 12;
      } else {
        stream += `BT\n/F1 9 Tf\n0.15 0.15 0.2 rg\n50 ${y} Td\n(${text}) Tj\nET\n`;
        y -= 13;
      }
    }

    const streamLength = Buffer.byteLength(stream, "utf8");

    // Page object
    objects.push({
      id: pair.pageObjId,
      content: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${pair.streamObjId} 0 R /Resources << /Font << /F1 ${fontF1Id} 0 R /F2 ${fontF2Id} 0 R /F3 ${fontF3Id} 0 R >> >> >>`
    });

    // Stream object
    objects.push({
      id: pair.streamObjId,
      content: `<< /Length ${streamLength} >>\nstream\n${stream}endstream`
    });
  }

  // Assemble PDF file
  let pdf = `%PDF-1.4\n`;
  const xref = [0];
  let offset = Buffer.byteLength(pdf, "utf8");

  // Sort objects by id
  objects.sort((a, b) => a.id - b.id);

  for (const obj of objects) {
    xref.push(offset);
    const objStr = `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
    pdf += objStr;
    offset += Buffer.byteLength(objStr, "utf8");
  }

  const startxref = offset;
  pdf += `xref\n0 ${xref.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < xref.length; i++) {
    pdf += String(xref[i]).padStart(10, "0") + ` 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  return Buffer.from(pdf, "utf8");
}
