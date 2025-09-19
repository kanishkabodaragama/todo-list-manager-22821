# Todo Frontend (React)

Classic-themed, lightweight React frontend for managing todo items. Implements add, list, update (inline), and delete with a polished, professional UI.

## Features
- Add todo
- List todos
- Update todo (inline edit: click text to edit, Enter to save, Escape to cancel)
- Delete todo
- Mark complete/incomplete
- Filters: All, Active, Completed
- Light/Dark theme toggle

## Style Guide
- ApplicationStyle: Classic
- Color palette:
  - primary: #000000
  - secondary/success: #F59E0B
  - error: #DC2626
  - background: #F3F4F6
  - surface: #FFFFFF
  - text: #111827
- Subtle shadows, clean layout, accent highlights on interactive elements.

## Getting Started
- npm start
- npm test
- npm run build

No external UI frameworks; styles defined in `src/App.css`.

## Notes
- The app uses in-memory state only and does not persist between reloads.
- Public interfaces are documented in `App.js` with the PUBLIC_INTERFACE marker.
