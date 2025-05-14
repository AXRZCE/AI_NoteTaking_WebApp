# Meeting Note Taker

A free, privacy-first web app for real-time meeting transcription and note-taking.  
**Built for organizations that require fast, secure, and easy-to-use note-taking tools—no installation, no server, no compromise on privacy.**

---

## 🚀 Vision

Our goal is to empower users in privacy-sensitive environments (like government and enterprise) to capture, organize, and export meeting notes with zero data leakage.  
Everything runs in your browser—your audio and notes never leave your device.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite (for blazing-fast development and performance)
- **Speech-to-Text:** Web Speech API (built into Chrome/Edge), optional OpenAI Whisper via whisper.cpp/WebAssembly (local, offline)
- **Export:** docx.js (Word file generation), file-saver (download support)
- **Styling:** Tailwind CSS (modern, responsive UI)
- **Storage:** Browser LocalStorage (secure, offline saving)
- **Hosting:** GitHub Pages / Netlify / Vercel (static, free, secure)
- **License:** MIT (fully open-source)

---

## 🔒 Key Requirements

- **Privacy:** All processing happens locally in the browser. No analytics, no cookies, no external storage.
- **Ease of Use:** Simple, distraction-free UI. Minimal clicks to start/stop transcription and export notes.
- **Flexibility:** Works with both online meetings and in-person speech.
- **Export:** One-click export to Word (.docx) or plain text for easy sharing or archival.
- **Open Source:** Anyone can audit, contribute, and use the project for free.

---

## 📋 Features

- Real-time speech-to-text transcription (browser mic or system audio)
- Instant note editing and organization (with timestamps, sections)
- Offline saving with LocalStorage
- Export notes to Microsoft Word (.docx) or text
- Responsive UI for desktop and mobile

---

## 📅 Project Plan (Sprints)

1. **Sprint 1:** Project setup, repo creation, dependencies, folder structure
2. **Sprint 2:** Core speech-to-text functionality (Web Speech API)
3. **Sprint 3:** Note editor and local storage integration
4. **Sprint 4:** Export/import features (.docx/text)
5. **Sprint 5:** UI polish, mobile responsiveness, accessibility
6. **Sprint 6:** Testing, optimization, documentation
7. **Sprint 7:** Deployment and feedback

---
