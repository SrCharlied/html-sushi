const STORAGE_KEY = 'htmlSushi_progress'

const defaultProgress = {
  completedLevels: [],
  currentLevel: 1,
  bestCode: {},
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultProgress, completedLevels: [], bestCode: {} }
    return JSON.parse(raw)
  } catch {
    return { ...defaultProgress, completedLevels: [], bestCode: {} }
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function markCompleted(levelId, code) {
  const progress = loadProgress()
  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId)
  }
  if (code) {
    progress.bestCode[levelId] = code
  }
  saveProgress(progress)
  return progress
}

export function setCurrentLevel(levelId) {
  const progress = loadProgress()
  progress.currentLevel = levelId
  saveProgress(progress)
}

export function isCompleted(levelId) {
  return loadProgress().completedLevels.includes(levelId)
}
