import React, { useState } from "react";
import exportToWord from "../utils/exportToWord.jsx";
import exportToPdf from "../utils/exportToPdf.jsx";
import { exportToDocx } from "../utils/exportUtils.js";

export default function ExportButton({ notes, noteTitle = "Meeting Notes", transcript }) {
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState(null); // 'word', 'pdf', or 'text'
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async (type) => {
    if (!notes.trim()) {
      return; // Don't export empty notes
    }

    setExporting(true);
    setExportType(type);
    setExportSuccess(false);

    try {
      if (type === 'word') {
        // Use the new DOCX export function
        const note = {
          title: noteTitle,
          content: notes,
          transcript: transcript,
          createdAt: new Date()
        };
        await exportToDocx(note);
      } else if (type === 'pdf') {
        await exportToPdf(notes, noteTitle);
      } else if (type === 'text') {
        // Export as text
        const textBlob = new Blob([notes], { type: 'text/plain' });
        const url = URL.createObjectURL(textBlob);
        const a = document.createElement('a');
        a.href = url;
        const safeTitle = noteTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
        a.download = `${safeTitle}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setExportSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
        setExportType(null);
      }, 3000);
    } catch (error) {
      console.error(`Export error (${type}):`, error);
    } finally {
      setExporting(false);
    }
  };

  const isDisabled = !notes.trim();

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleExport('word')}
          className={`px-3 py-1 rounded-lg shadow-sm transition-colors flex items-center gap-1 ${
            isDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={isDisabled || exporting}
          aria-label="Export notes as Word document"
        >
          {exporting && exportType === 'word' ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Word</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <span>Word</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleExport('pdf')}
          className={`px-3 py-1 rounded-lg shadow-sm transition-colors flex items-center gap-1 ${
            isDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          disabled={isDisabled || exporting}
          aria-label="Export notes as PDF document"
        >
          {exporting && exportType === 'pdf' ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>PDF</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <span>PDF</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleExport('text')}
          className={`px-3 py-1 rounded-lg shadow-sm transition-colors flex items-center gap-1 ${
            isDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-800 text-white"
          }`}
          disabled={isDisabled || exporting}
          aria-label="Export notes as plain text"
        >
          {exporting && exportType === 'text' ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Text</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <span>Text</span>
            </>
          )}
        </button>
      </div>

      {exportSuccess && (
        <div className="mt-2 text-green-600 flex items-center gap-1 text-sm" role="status">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {exportType === 'word' && 'Word document exported!'}
          {exportType === 'pdf' && 'PDF document exported!'}
          {exportType === 'text' && 'Text file exported!'}
        </div>
      )}
    </div>
  );
}
