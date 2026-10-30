"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple, elegant, and crash-proof Markdown parser for medical text
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let inList = false;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (inList && currentList.length > 0) {
      renderedElements.push(
        <ul key={`ul-${renderedElements.length}`} className="my-2 space-y-1 pr-5 list-disc text-slate-800">
          {currentList.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderFormattedText(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      const header = tableRows[0];
      const rows = tableRows.slice(1).filter((r) => !r.every((cell) => cell.includes("---")));

      renderedElements.push(
        <div key={`table-${renderedElements.length}`} className="my-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-right text-xs md:text-sm">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                {header.map((col, idx) => (
                  <th key={idx} className="border-b border-slate-200 p-2 font-semibold">
                    {renderFormattedText(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/70">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2 text-slate-700">
                      {renderFormattedText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Table row detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      inTable = true;
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      tableRows.push(cells);
      return;
    } else if (inTable) {
      flushTable();
    }

    // List item detection
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || /^\d+\.\s/.test(trimmed)) {
      inList = true;
      const itemText = trimmed.replace(/^(\*|-|\d+\.)\s+/, "");
      currentList.push(itemText);
      return;
    } else {
      flushList();
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h3 key={index} className="mt-3 mb-1 text-base md:text-lg font-bold text-blue-900 border-r-4 border-blue-600 pr-2">
          {renderFormattedText(trimmed.replace("### ", ""))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h2 key={index} className="mt-4 mb-2 text-lg md:text-xl font-extrabold text-blue-950 border-b border-slate-200 pb-1">
          {renderFormattedText(trimmed.replace("## ", ""))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      renderedElements.push(
        <h1 key={index} className="mt-4 mb-2 text-xl md:text-2xl font-black text-blue-950">
          {renderFormattedText(trimmed.replace("# ", ""))}
        </h1>
      );
      return;
    }

    // Emergency or warning callout
    if (trimmed.startsWith("⚠️") || trimmed.startsWith("🚨") || trimmed.includes("طوارئ")) {
      renderedElements.push(
        <div
          key={index}
          className="my-3 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 font-medium shadow-sm leading-relaxed"
        >
          {renderFormattedText(trimmed)}
        </div>
      );
      return;
    }

    // Regular paragraphs or blank lines
    if (trimmed === "") {
      renderedElements.push(<div key={index} className="h-2" />);
    } else {
      renderedElements.push(
        <p key={index} className="my-1.5 leading-relaxed text-slate-800 text-sm md:text-base">
          {renderFormattedText(trimmed)}
        </p>
      );
    }
  });

  flushList();
  flushTable();

  return <div className="space-y-1">{renderedElements}</div>;
};

// Render bold, inline highlight, code, etc.
function renderFormattedText(text: string): React.ReactNode {
  // Split by bold markdown **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
