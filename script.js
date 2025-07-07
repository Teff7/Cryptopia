// script.js - updated to use local clues.json for testing

// Game mode and difficulty variables
elet mode = 'normal';
let level = 'easy';

// Load all clues from the local JSON file
let allClues = [];
window.addEventListener('load', () => {
  fetch('clues.json')
    .then(res => res.json())
    .then(json => { allClues = json; })
    .catch(err => console.error('Failed to load clues:', err));
});

// Menu button handlers
document.querySelectorAll('.menu-btn[data-type]').forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.type;
    document.querySelectorAll('.menu-btn[data-type]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
document.querySelectorAll('.menu-btn[data-difficulty]').forEach(btn => {
  btn.addEventListener('click', () => {
    level = btn.dataset.difficulty;
    document.querySelectorAll('.menu-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Start the game, hide welcome screen and show game screen
function startGame() {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  fetchClue(0);
}

// Fetch one of the 5 puzzles from the loaded JSON pool
function fetchClue(index) {
  const today = new Date().toISOString().split('T')[0];
  // Filter for today's clues matching mode and difficulty
  const pool = allClues.filter(p =>
    p.date === today &&
    p.type === mode &&
    p.difficulty === level
  );
  // Pick the requested index or default to first
  const entry = pool[index] || pool[0];
  if (!entry) {
    // No matching clue found
    document.getElementById('clue').textContent = 'No clue available';
    return;
  }
  setupGame(entry.clue, entry.answer, index);
}

// Game state variables
let answer = '';
let letters = [];
let activeIndex = 0;
let currentIndex = 0;
const clueDiv = document.getElementById('clue');
const squaresDiv = document.getElementById('squares');
const gameScreen = document.getElementById('game');

// Initialise puzzle display
function setupGame(clueText, ans, idx) {
  answer = ans;
  letters = Array(answer.length).fill('');
  activeIndex = 0;
  currentIndex = idx;
  clueDiv.textContent = clueText;
  renderSquares();
}

// Render the letter squares
function renderSquares() {
  squaresDiv.innerHTML = '';
  letters.forEach((ltr, i) => {
    const box = document.createElement('div');
    box.className = 'square';
    box.textContent = ltr;
    box.addEventListener('click', () => {
      activeIndex = i;
      highlightActive();
    });
    squaresDiv.appendChild(box);
  });
  highlightActive();
}

// Highlight the active square
function highlightActive() {
  document.querySelectorAll('.square').forEach((b, i) => {
    b.classList.toggle('active', i === activeIndex);
  });
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (/^[a-zA-Z]$/.test(e.key) && activeIndex >= 0) {
    letters[activeIndex] = e.key.toUpperCase();
    if (activeIndex < letters.length - 1) activeIndex++;
    renderSquares();
  } else if (e.key === 'Backspace') {
    letters[activeIndex] = '';
    if (activeIndex > 0) activeIndex--;
    renderSquares();
  } else if (e.key === 'Enter') {
    submitAnswer();
  }
});

// Submit answer and advance or show fireworks
function submitAnswer() {
  if (letters.join('') === answer) {
    gameScreen.classList.add('flash-green');
    setTimeout(() => {
      gameScreen.classList.remove('flash-green');
      currentIndex++;
      if (currentIndex < 5) {
        fetchClue(currentIndex);
      } else {
        document.getElementById('submitBtn').style.display = 'none';
        showFireworks();
      }
    }, 2000);
  } else {
    gameScreen.classList.add('flash-red');
    setTimeout(() => gameScreen.classList.remove('flash-red'), 600);
  }
}

// Simple pixel fireworks display
function showFireworks() {
  const container = document.getElementById('fireworks');
  for (let i = 0; i < 100; i++) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.top = `${Math.random() * 100}vh`;
    pixel.style.left = `${Math.random() * 100}vw`;
    container.appendChild(pixel);
  }
}
