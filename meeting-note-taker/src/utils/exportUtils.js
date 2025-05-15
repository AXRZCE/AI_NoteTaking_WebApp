import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Exports a meeting note to a DOCX file
 * @param {Object} note - The note object to export
 * @param {string} note.title - The title of the note
 * @param {string} note.content - The content of the note
 * @param {string} note.transcript - The transcript of the note (optional)
 * @param {Date} note.createdAt - The creation date of the note
 */
export const exportToDocx = async (note) => {
  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: note.title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),
          
          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: `Created: ${new Date(note.createdAt).toLocaleString()}`,
                italics: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: {
              after: 400,
            },
          }),
          
          // Meeting Notes Section
          new Paragraph({
            text: "Meeting Notes",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200,
            },
          }),
          
          // Meeting Notes Content
          new Paragraph({
            text: note.content || "No notes recorded.",
            spacing: {
              after: 400,
            },
          }),
          
          // Transcript Section (if available)
          ...(note.transcript ? [
            new Paragraph({
              text: "Transcript",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                after: 200,
              },
            }),
            new Paragraph({
              text: note.transcript,
            }),
          ] : []),
        ],
      },
    ],
  });

  // Generate the DOCX file
  const blob = await Packer.toBlob(doc);
  
  // Save the file
  saveAs(blob, `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.docx`);
};
