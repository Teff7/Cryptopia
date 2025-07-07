// script.js - using local clues.json, without date filtering

// Game mode and difficulty variables
let mode = 'normal';
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
  // For testing, ignore the date
  const pool = allClues.filter(p =>
    p.type === mode &&
    p.difficulty === level
  );
  const entry = pool[index] || pool[0];
  if (!entry) {
    document.getElementById('clue').textContent = 'No clue available';
    return;
  }
  setupGame(entry.clue, entry.answer, index);
}

// Game state variables
let answer = '';
let letters = [];
let activeI
