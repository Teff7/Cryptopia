let mode = 'normal';
let level = 'easy';

document.querySelectorAll('.menu-btn[data-type]').forEach(btn => {
  btn.onclick = () => {
    mode = btn.dataset.type;
    document.querySelectorAll('.menu-btn[data-type]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };
});
document.querySelectorAll('.menu-btn[data-difficulty]').forEach(btn => {
  btn.onclick = () => {
    level = btn.dataset.difficulty;
    document.querySelectorAll('.menu-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };
});

function startGame() {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  fetchClue();
}

async function fetchClue() {
  const today = new Date().toISOString().split('T')[0];
  const res = await fetch(`https://your-api-url.repl.co/api/clue?date=${today}&type=${mode}&difficulty=${level}`);
  const data = await res.json();
  setupGame(data.clue, data.answer.toUpperCase());
}

let clueText, answer, letters, activeIndex;
const clueDiv = document.getElementById('clue');
const squaresDiv = document.getElementById('squares');
const gameScreen = document.getElementById('game');

function setupGame(clue, ans) {
  clueText = clue;
  answer = ans;
  letters = Array(answer.length).fill('');
  activeIndex = 0;
  clueDiv.textContent = clueText;
  renderSquares();
}

function renderSquares() {
  squaresDiv.innerHTML = '';
  letters.forEach((ltr, i) => {
    const box = document.createElement('div');
    box.className = 'square';
    box.textContent = ltr;
    box.onclick = () => {
      activeIndex = i;
      highlightActive();
    };
    squaresDiv.appendChild(box);
  });
  highlightActive();
}

function highlightActive() {
  document.querySelectorAll('.square').forEach((b, i) => {
    b.
