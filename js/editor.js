let editorRoot = null
let inputEl = null
let gutterEl = null
let onRunCallback = null
let readOnlyLineCount = 0

const MIN_LINES = 12

export function createEditor(container, onRun) {
  onRunCallback = onRun

  editorRoot = document.createElement('div')
  editorRoot.className = 'custom-editor'
  editorRoot.addEventListener('click', () => {
    if (inputEl) inputEl.focus()
  })
  container.appendChild(editorRoot)

  return editorRoot
}

export function setPreCode(preCode, preCode2) {
  if (!editorRoot) return

  editorRoot.innerHTML = ''
  readOnlyLineCount = 0

  const codes = [preCode, preCode2].filter(Boolean)
  let lineNum = 1

  for (const text of codes) {
    const blockLines = String(text).split('\n')

    for (const blockLine of blockLines) {
      const line = document.createElement('div')
      line.className = 'editor-line readonly'

      const num = document.createElement('span')
      num.className = 'line-num'
      num.textContent = lineNum

      const code = document.createElement('span')
      code.className = 'line-text'
      code.textContent = blockLine || ' '

      line.appendChild(num)
      line.appendChild(code)
      editorRoot.appendChild(line)

      lineNum++
      readOnlyLineCount++
    }
  }

  const editBlock = document.createElement('div')
  editBlock.className = 'editor-edit-block'

  gutterEl = document.createElement('div')
  gutterEl.className = 'editor-edit-gutter'

  inputEl = document.createElement('textarea')
  inputEl.className = 'code-input'
  inputEl.spellcheck = false
  inputEl.autocomplete = 'off'
  inputEl.wrap = 'off'

  inputEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (onRunCallback) onRunCallback()
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      insertAtSelection('  ')
      return
    }

    if (e.key === 'Escape') {
      inputEl.blur()
    }
  })

  inputEl.addEventListener('input', updateLineNumbers)
  inputEl.addEventListener('scroll', () => {
    if (gutterEl) {
      gutterEl.scrollTop = inputEl.scrollTop
    }
  })

  editBlock.appendChild(gutterEl)
  editBlock.appendChild(inputEl)
  editorRoot.appendChild(editBlock)

  updateLineNumbers()
}

export function setEditorContent(code, prefix = '') {
  if (!inputEl) return

  const text = String(code || '')
  inputEl.value = prefix && !text.startsWith(prefix) ? `${prefix}${text}` : text
  updateLineNumbers()
}

export function getEditorContent() {
  if (!inputEl) return ''
  return inputEl.value
}

export function getEditableContent() {
  if (!inputEl) return ''
  return inputEl.value
}

export function focusEditor() {
  if (inputEl) inputEl.focus()
}

function updateLineNumbers() {
  if (!gutterEl || !inputEl) return

  const editableLines = Math.max(MIN_LINES - readOnlyLineCount, inputEl.value.split('\n').length)

  gutterEl.innerHTML = Array.from({ length: editableLines }, (_, index) => {
    return `<div class="line-num">${readOnlyLineCount + index + 1}</div>`
  }).join('')
}

function insertAtSelection(text) {
  if (!inputEl) return

  const { selectionStart, selectionEnd, value } = inputEl
  inputEl.value = value.slice(0, selectionStart) + text + value.slice(selectionEnd)

  const nextCaret = selectionStart + text.length
  inputEl.selectionStart = nextCaret
  inputEl.selectionEnd = nextCaret

  updateLineNumbers()
}
