import React from "react";

const NoteEditor = ({ notes, setNotes, fontSize = 16 }) => {
  const handleChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="meeting-notes" className="block font-bold">
          Meeting Notes:
        </label>
        <div className="text-sm text-gray-500">
          {notes.length} characters
        </div>
      </div>

      <textarea
        id="meeting-notes"
        className="w-full h-56 p-2 border rounded-xl focus:outline-none focus:ring"
        style={{ fontSize: `${fontSize}px` }}
        value={notes}
        onChange={handleChange}
        placeholder="Edit your meeting notes here..."
        aria-label="Meeting notes editor"
      />

      <div className="mt-2 text-sm text-gray-600">
        <p>
          You can edit these notes while speech recognition is paused.
          When speech recognition is active, new text will be added based on the append mode setting.
        </p>
      </div>
    </div>
  );
};

export default NoteEditor;
