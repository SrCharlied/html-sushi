const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
const BASE_TAG_RE = /<base\b[^>]*>/gi

function sanitizeMarkup(markup) {
  return String(markup || '')
    .replace(SCRIPT_TAG_RE, '')
    .replace(BASE_TAG_RE, '')
}

function buildEmptyState() {
  return `
    <section class="preview-empty">
      <h1>Vista previa HTML</h1>
      <p>Escribe algo en el editor y luego pulsa Preview.</p>
      <p>Tambien puedes usar Ctrl+Enter o Cmd+Enter.</p>
    </section>
  `
}

function buildPreviewShell(content) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          :root {
            color-scheme: light;
            font-family: Arial, sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 24px;
            min-height: 100vh;
            background: #fffdf8;
            color: #1f2937;
          }

          .preview-empty {
            min-height: calc(100vh - 48px);
            display: grid;
            place-content: center;
            gap: 12px;
            text-align: center;
            border: 2px dashed #d6c7a5;
            border-radius: 18px;
            background: linear-gradient(180deg, #fffef7 0%, #fff5d9 100%);
            padding: 32px;
          }

          .preview-empty h1,
          .preview-empty p {
            margin: 0;
          }

          .preview-empty h1 {
            font-size: 1.4rem;
          }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `
}

export function buildPreviewDocument(markup) {
  const safeMarkup = sanitizeMarkup(markup)
  const trimmedMarkup = safeMarkup.trim()
  const hasFullDocument = /<!doctype|<html[\s>]|<head[\s>]|<body[\s>]/i.test(trimmedMarkup)

  if (!trimmedMarkup) {
    return buildPreviewShell(buildEmptyState())
  }

  if (hasFullDocument) {
    return safeMarkup
  }

  return buildPreviewShell(safeMarkup)
}

export function renderPreview(frameEl, markup) {
  if (!frameEl) return
  frameEl.srcdoc = buildPreviewDocument(markup)
}

export function evaluateMissions(level, markup) {
  const missions = Array.isArray(level?.missions) ? level.missions : []
  if (missions.length === 0) return []

  const documentMarkup = buildPreviewDocument(markup)
  const document = new DOMParser().parseFromString(documentMarkup, 'text/html')
  const safeMarkup = sanitizeMarkup(markup)

  return missions.map((mission) => {
    if (typeof mission?.validate !== 'function') {
      return false
    }

    try {
      return Boolean(mission.validate({ document, markup: safeMarkup }))
    } catch {
      return false
    }
  })
}
