# Meeting Note Taker

A privacy-focused web application for taking meeting notes with speech-to-text capabilities. All processing happens locally in your browser - no data is sent to any server.

> **Note**: Screenshots will be added after deployment.

## Live Demo

Try the application here: [Meeting Note Taker](https://AXRZCE.github.io/AI_NoteTaking_WebApp/)

## Features

- **Speech-to-Text**: Automatically transcribe speech during meetings
- **Privacy-First**: All processing happens in your browser
- **Dark/Light Mode**: Choose your preferred theme or use system settings
- **Export Options**: Save your notes as DOCX, PDF, or plain text
- **Import Functionality**: Import existing notes from text files
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Capable**: No internet required after initial load
- **Note Management**: Create, edit, archive, and delete notes
- **Customizable Settings**: Adjust font size, language, and more

## Installation and Local Development

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/AXRZCE/AI_NoteTaking_WebApp.git
   cd meeting-note-taker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Browser Compatibility

The application works best in modern browsers that support the Web Speech API:

- Chrome (desktop & mobile)
- Edge
- Safari (desktop & mobile)
- Firefox

> **Note**: Speech recognition features work best in Chrome and Edge.

## Privacy

Meeting Note Taker is designed with privacy in mind:

- All speech recognition happens locally using your browser's Web Speech API
- Notes are stored only in your browser's local storage
- No data is sent to any external servers
- Optional privacy lock mode can clear all data when you close the browser

## Usage Guide

### Creating a New Note

1. Click the "+ New Note" button in the sidebar
2. A new note will be created and selected automatically

### Using Speech-to-Text

1. Select a note or create a new one
2. In the Speech Recognition section, click "Start"
3. Begin speaking - your words will appear in the transcript
4. Click "Stop" when you're finished
5. The transcript will be added to your note

### Append Mode

- When enabled, new speech will be added to the end of existing notes
- When disabled, new speech will replace existing content

### Exporting Notes

1. Select the note you want to export
2. Click one of the export buttons at the bottom of the note editor:
   - Word (DOCX)
   - PDF
   - Text

### Importing Notes

1. Click the "Import" button
2. Select a text file from your device
3. The content will be imported into the current note

### Archiving and Deleting Notes

- To archive a note, click the "Archive" button on the note in the sidebar
- To view archived notes, click the "Archived" tab in the sidebar
- To delete a note permanently, click the "Delete" button on the note

## Technologies Used

- React
- Vite
- Tailwind CSS
- Web Speech API
- docx (for Word document export)
- jsPDF (for PDF export)
- file-saver

## License

This project is licensed under the MIT License.

## Acknowledgments

- The Web Speech API for enabling privacy-focused speech recognition
- The React community for excellent tools and libraries
