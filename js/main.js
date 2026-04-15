import levels from './levels/index.js'
import { loadProgress, setCurrentLevel } from './progress.js'
import { evaluateMissions, renderPreview } from './engine.js'
import { createEditor, setEditorContent, setPreCode, getEditableContent, focusEditor } from './editor.js'
import { initUI, renderLevel, showFeedback, updateMissionStatus } from './ui.js'

let currentLevel = null
const previewFrame = document.getElementById('preview-frame')

function navigateToLevel(id) {
  const level = levels.find((l) => l.id === id)
  if (!level) return

  currentLevel = level
  setCurrentLevel(id)
  renderLevel(level)
  setPreCode(level.preCode, level.preCode2)
  setEditorContent(level.initialCode || '', level.lockedPrefix || '')
  const markup = getEditableContent()
  renderPreview(previewFrame, markup)
  updateMissionStatus(level, evaluateMissions(level, markup))
  focusEditor()
}

function runCode() {
  if (!currentLevel) return

  const markup = getEditableContent()
  renderPreview(previewFrame, markup)
  updateMissionStatus(currentLevel, evaluateMissions(currentLevel, markup))
  showFeedback('Vista previa actualizada.', 'info')

  if (window.innerWidth <= 1200) {
    document.querySelector('.preview-area').scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
}

function init() {
  const editorContainer = document.getElementById('editor-container')
  createEditor(editorContainer, runCode)

  document.getElementById('run-btn').addEventListener('click', runCode)

  initUI(navigateToLevel)

  const progress = loadProgress()
  const startLevel = levels.some((level) => level.id === progress.currentLevel) ? progress.currentLevel : 1
  navigateToLevel(startLevel)
}

init()
