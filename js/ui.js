import levels from './levels/index.js'
import { loadProgress } from './progress.js'

const levelTitle = document.getElementById('level-title')
const levelSubtitle = document.getElementById('level-subtitle')
const levelDesc = document.getElementById('level-description')
const hintBtn = document.getElementById('hint-btn')
const hintModal = document.getElementById('hint-modal')
const hintModalOverlay = document.getElementById('hint-modal-overlay')
const levelHint = document.getElementById('level-hint')
const missionsBtn = document.getElementById('missions-btn')
const missionsModal = document.getElementById('missions-modal')
const missionsModalOverlay = document.getElementById('missions-modal-overlay')
const missionsList = document.getElementById('missions-list')
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')
const currentLevelEl = document.getElementById('current-level')
const totalLevelsEl = document.getElementById('total-levels')
const levelDropdown = document.getElementById('level-dropdown')
const levelModal = document.getElementById('level-modal')
const levelModalOverlay = document.getElementById('level-modal-overlay')
const levelGrid = document.getElementById('level-grid')

let onNavigate = null
let currentLevelId = 1

export function initUI(navigateCallback) {
  onNavigate = navigateCallback

  totalLevelsEl.textContent = levels.length

  prevBtn.addEventListener('click', () => {
    const current = getCurrentIndex()
    if (current > 0) onNavigate(levels[current - 1].id)
  })

  nextBtn.addEventListener('click', () => {
    const current = getCurrentIndex()
    if (current < levels.length - 1) onNavigate(levels[current + 1].id)
  })

  levelDropdown.addEventListener('click', () => {
    const isOpen = !levelModal.classList.contains('hidden')
    if (isOpen) {
      closeModal()
    } else {
      levelModal.classList.remove('hidden')
      levelModalOverlay.classList.remove('hidden')
    }
  })

  levelModalOverlay.addEventListener('click', closeModal)

  hintBtn.addEventListener('click', () => {
    if (hintBtn.classList.contains('next-lesson-btn')) return
    const isOpen = !hintModal.classList.contains('hidden')
    if (isOpen) {
      closeHint()
    } else {
      hintModal.classList.remove('hidden')
      hintModalOverlay.classList.remove('hidden')
    }
  })

  hintModalOverlay.addEventListener('click', closeHint)

  missionsBtn.addEventListener('click', () => {
    const isOpen = !missionsModal.classList.contains('hidden')
    if (isOpen) {
      closeMissions()
    } else {
      missionsModal.classList.remove('hidden')
      missionsModalOverlay.classList.remove('hidden')
    }
  })

  missionsModalOverlay.addEventListener('click', closeMissions)

  buildLevelSelector()
}

function closeModal() {
  levelModal.classList.add('hidden')
  levelModalOverlay.classList.add('hidden')
}

function closeHint() {
  hintModal.classList.add('hidden')
  hintModalOverlay.classList.add('hidden')
}

function closeMissions() {
  missionsModal.classList.add('hidden')
  missionsModalOverlay.classList.add('hidden')
}

function getCurrentIndex() {
  return levels.findIndex((l) => l.id === currentLevelId)
}

function buildLevelSelector() {
  levelGrid.innerHTML = ''
  const progress = loadProgress()
  levels.forEach((level) => {
    const btn = document.createElement('button')
    btn.textContent = level.id
    btn.className = 'level-dot'
    if (level.id === currentLevelId) {
      btn.classList.add('active')
    }
    if (progress.completedLevels.includes(level.id)) {
      btn.classList.add('completed')
    }
    btn.addEventListener('click', () => {
      onNavigate(level.id)
      closeModal()
    })
    levelGrid.appendChild(btn)
  })
}

export function renderLevel(level) {
  currentLevelId = level.id

  levelTitle.textContent = `${level.id}. ${level.title}`
  levelSubtitle.textContent = level.subtitle || ''
  levelSubtitle.classList.toggle('hidden', !level.subtitle)
  levelDesc.innerHTML = level.description
  levelHint.textContent = level.hint || ''
  closeHint()
  closeMissions()
  currentLevelEl.textContent = level.id

  // Remove success styling from instructions
  document.querySelector('.instructions-area').classList.remove('success-state')

  // Restore hint button
  hintBtn.classList.remove('next-lesson-btn')
  hintBtn.innerHTML = '<img class="hint-icon" src="svg/light.svg" alt=""><span>Ver pista</span>'
  hintBtn.onclick = null

  renderMissions(level, [])

  const idx = levels.findIndex((l) => l.id === level.id)
  prevBtn.disabled = idx === 0
  nextBtn.disabled = idx === levels.length - 1

  clearFeedback()
  updateLevelSelector()
}

const congrats = [
  'Correct!',
  'Nailed it!',
  'Nice one!',
  'That\'s it!',
  'You got it!',
  'Well done!',
  'Spot on!',
  'Perfect!',
]

function randomCongrats() {
  return congrats[Math.floor(Math.random() * congrats.length)]
}

export function showLevelSuccess(level) {
  // Swap instructions body with success message (random prefix so it's clearly feedback)
  levelDesc.innerHTML = `<p><strong>${randomCongrats()}</strong> ${level.successMessage || 'Great job!'}</p>`

  // Add green accent to instructions card so it looks different from the original prompt
  const instructionsCard = document.querySelector('.instructions-area')
  instructionsCard.classList.add('success-state')

  // Replace hint button with Next Lesson button
  closeHint()
  const idx = levels.findIndex((l) => l.id === level.id)
  const isLast = idx >= levels.length - 1

  if (!isLast) {
    hintBtn.classList.add('next-lesson-btn')
    hintBtn.innerHTML = '<span>Next Lesson &rsaquo;</span>'
    hintBtn.onclick = (e) => {
      e.stopPropagation()
      onNavigate(levels[idx + 1].id)
    }
  }
}

export function updateLevelSelector() {
  const progress = loadProgress()
  const dots = levelGrid.querySelectorAll('.level-dot')
  dots.forEach((dot, i) => {
    const level = levels[i]
    dot.classList.toggle('completed', progress.completedLevels.includes(level.id))
    dot.classList.toggle('active', level.id === currentLevelId)
  })
}

export function updateMissionStatus(level, states) {
  renderMissions(level, states)
}

function renderMissions(level, states) {
  const missions = Array.isArray(level.missions) ? level.missions : []
  const missionStates = Array.isArray(states) ? states : []

  if (missions.length === 0) {
    missionsBtn.classList.add('hidden')
    missionsList.innerHTML = ''
    return
  }

  const completedCount = missionStates.filter(Boolean).length
  missionsBtn.classList.remove('hidden')
  missionsBtn.innerHTML = `<span>Misiones ${completedCount}/${missions.length}</span>`
  missionsList.innerHTML = `
    <h3 class="missions-title">Misiones</h3>
    <ol class="missions-list">
      ${missions.map((mission, index) => {
        const done = Boolean(missionStates[index])
        const text = typeof mission === 'string' ? mission : mission.text
        return `
          <li class="${done ? 'mission-done' : 'mission-pending'}">
            <span class="mission-status">${done ? 'Hecha' : 'Pendiente'}</span>
            <span>${text}</span>
          </li>
        `
      }).join('')}
    </ol>
  `
}

let toastTimer = null

export function showFeedback(message, type) {
  clearFeedback()
  const container = document.getElementById('editor-container')
  const toast = document.createElement('div')
  toast.className = `editor-toast ${type}`
  toast.textContent = message
  container.appendChild(toast)
  toastTimer = setTimeout(clearFeedback, 4000)
}

export function clearFeedback() {
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
  document.querySelectorAll('.editor-toast').forEach((el) => el.remove())
}
