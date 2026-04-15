# HTML Sushi

A browser-based beginner HTML practice app with a sushi theme. Students edit HTML, preview it live, and complete simple missions.

## Project Structure

```text
index.html          - Single-page app shell
js/
  main.js           - App init, lesson navigation, preview updates
  engine.js         - Sandboxed HTML preview document builder
  editor.js         - Multiline custom editor with line numbers
  ui.js             - Lesson rendering, hints, missions, selector UI
  progress.js       - localStorage persistence
  levels/
    index.js        - All lesson definitions
css/
  style.css         - Global base styles
  bento.css         - Main layout
  instructions.css  - Lesson card, hint modal, missions modal
  editor-area.css   - Editor and preview button styles
  title.css         - Title card styling
  variables.css     - Theme variables
  wood-grain.css    - Decorative wood texture rules
svg/
  mascot.svg        - Main mascot
  light.svg         - Hint icon
  paper.svg         - Misc decorative asset
```

## Architecture

- No build step
- ES modules loaded directly in the browser
- Preview rendered with `iframe.srcdoc`
- Preview sandboxed with `sandbox=""`
- Lessons defined as plain objects in `js/levels/index.js`
- UI supports hints and optional missions per lesson

## Lesson Data Shape

Each lesson can define:

- `id`
- `title`
- `subtitle`
- `description`
- `hint`
- `missions`
- `preCode`
- `preCode2`
- `lockedPrefix`
- `initialCode`

Only `title`, `description`, and `initialCode` are effectively required for the current flow.

## Current Scope

The app currently teaches:

1. Basic HTML5 tags
2. Advanced HTML tags
3. HTML5 forms

## Editing Notes

- Keep explanations simple and beginner-friendly
- Prefer short missions that encourage visible changes
- Preserve the sushi theme unless the user asks to remove it
- Avoid reintroducing JavaScript-array-specific logic or old belt-rendering modules
