# HTML Sushi

HTML Sushi is a small browser game for practicing basic HTML through a sushi-themed interface. Students edit real HTML, preview it live, and explore three beginner lessons:

- Basic HTML5 tags
- Advanced tags
- HTML5 forms

## How It Works

Each lesson includes:

- A short explanation
- A hint
- Optional missions
- A multiline HTML editor
- A live preview rendered inside a sandboxed iframe

The goal is to let beginners change code and immediately see what happens.

## Current Lessons

### 1. Basic HTML5 Tags

Focuses on:

- Basic tags like `h1`, `p`, and `div`
- Text formatting
- Images
- Audio
- Video
- Colors with inline styles

### 2. Advanced Tags

Focuses on:

- Lists
- Tables
- Page layout tags
- Folder paths
- Links

### 3. HTML5 Forms

Focuses on:

- Forms
- Labels
- Text inputs
- Select fields
- Checkboxes and radio buttons
- Buttons
- Basic form submission attributes

## Project Structure

```text
index.html
js/
  main.js
  engine.js
  editor.js
  ui.js
  progress.js
  levels/
    index.js
css/
  style.css
  bento.css
  instructions.css
  editor-area.css
  title.css
  variables.css
  wood-grain.css
svg/
  mascot.svg
  light.svg
  paper.svg
  plates/
  sushi/
```

## Notes

- No build step is required
- The app uses ES modules directly in the browser
- The live preview uses `iframe.srcdoc` with `sandbox`
- Student progress is stored in `localStorage`
