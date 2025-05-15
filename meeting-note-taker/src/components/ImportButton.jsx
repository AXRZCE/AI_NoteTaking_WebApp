import React, { useState, useRef } from 'react';
import { importFromFile } from '../utils/importNotes.jsx';

export default function ImportButton({ onImport }) {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setSuccess(false);

    try {
      const content = await importFromFile(file);
      if (onImport) {
        onImport(content);
      }
      setSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
      // Reset the file input
      e.target.value = null;
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.docx"
        className="hidden"
        aria-label="Import notes from file"
      />

      <button
        onClick={handleImportClick}
        className={`px-3 py-1 rounded-lg shadow-sm transition-colors flex items-center gap-1 ${
          importing
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
        disabled={importing}
        aria-label="Import notes from file"
      >
        {importing ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Importing...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Import</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 text-red-600 text-sm" role="alert">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mt-2 text-green-600 text-sm flex items-center gap-1" role="status">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          File imported successfully!
        </div>
      )}
    </div>
  );
}
