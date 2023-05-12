const folderPath = 'collection-B/';
const audioPath = folderPath + 'audio/';
const coverPath = folderPath + 'covers/';
const batchPrefix = 'batch-C_';
const batchQuantity = 100;
const coverPrefix = 'mural_';
let player;
let currentIndex
let playbackPosition = 0;
let lastStopTime = 0;

function setup() {
  createGrid();
  document.addEventListener('keydown', handleKeyDown);
  document.getElementById('cover-image').addEventListener('click', toggleGrid);
  resizeGrid();
  window.addEventListener('resize', resizeGrid);
}

function resizeGrid() {
  const gridContainer = document.getElementById('grid-container');
  const coverContainer = document.getElementById('cover-container');
  const coverImage = document.getElementById('cover-image');
  const windowAspectRatio = window.innerWidth / window.innerHeight;
  if (windowAspectRatio > 1) {
    gridContainer.style.width = `${window.innerHeight}px`;
    gridContainer.style.height = `${window.innerHeight}px`;
    coverContainer.style.width = `${window.innerHeight}px`;
    coverContainer.style.height = `${window.innerHeight}px`;
  } else {
    gridContainer.style.width = `${window.innerWidth}px`;
    gridContainer.style.height = `${window.innerWidth}px`;
    coverContainer.style.width = `${window.innerWidth}px`;
    coverContainer.style.height = `${window.innerWidth}px`;
  }
}

function createGrid() {
  const gridContainer = document.getElementById('grid-container');
  for (let i = 1; i <= batchQuantity; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-square');
    square.dataset.index = i;
    square.onmouseover = () => showIndex(square, i);
    square.onmouseout = () => hideIndex(square);
    square.onclick = () => loadSongAndCover(i, true);
    const indexLabel = document.createElement('span');
    indexLabel.classList.add('index-label');
    indexLabel.textContent = i;
    square.appendChild(indexLabel);
    gridContainer.appendChild(square);
  }
}

function showIndex(square, index) {
  square.querySelector('.index-label').style.display = 'block';
}

function hideIndex(square) {
  square.querySelector('.index-label').style.display = 'none';
}

async function loadSongAndCover(index, toggle) {
  if (!player) {
    player = new Tone.Player().toDestination();
  } else if (player.state === 'started') {
    player.stop();
  }

  const songPath = audioPath + batchPrefix + index + '.mp3';
  await player.load(songPath);
  await Tone.start();
  player.start();

  const coverPathWithIndex = coverPath + coverPrefix + pad(index, 3) + '.png';
  const coverImage = document.getElementById('cover-image');
  coverImage.src = coverPathWithIndex;

  if (toggle) {
    toggleGrid();
  }

  currentIndex = index;
}

function toggleGrid() {
  const gridContainer = document.getElementById('grid-container');
  const coverContainer = document.getElementById('cover-container');
  const gridSquares = document.querySelectorAll('.grid-square');

  if (gridContainer.classList.contains('hidden')) {
    // Show grid and hide cover
    gridContainer.classList.remove('hidden');
    coverContainer.classList.add('hidden');
    gridSquares.forEach(square => square.classList.remove('hidden'));
  } else {
    // Hide grid and show cover
    gridContainer.classList.add('hidden');
    coverContainer.classList.remove('hidden');
    gridSquares.forEach(square => square.classList.add('hidden'));
  }
}

// Add this new function in scripts.js
// function showGrid() {
//   gridContainer.classList.remove('hidden');
//   coverContainer.classList.add('hidden');
//   player.pause();
// }

// Add this new function
async function handleKeyDown(event) {
  if (!player) return;

  let newIndex;

  switch (event.key) {
    case ' ':
      if (player.state === 'started') {
        // const elapsedTime = player.context.currentTime - lastStopTime;
        // lastStopTime = player.context.currentTime;
        // console.log(playbackPosition);
        // console.log(player.context.currentTime);
        // console.log(lastStopTime);
        player.stop();
        lastStopTime = player.context.currentTime;
        playbackPosition = player.context.currentTime;
      } else {
        // console.log(playbackPosition);
        // console.log(player.context.currentTime);
        // console.log(lastStopTime);
        const timeElapsed = player.context.currentTime;
        player.start(undefined, playbackPosition);
      }
      break;
    case 'r':
      newIndex = Math.floor(Math.random() * batchQuantity) + 1;
      //window.alert("r");
      await loadSongAndCover(newIndex, false);
      break;
    case 'ArrowRight':
      newIndex = (currentIndex % batchQuantity) + 1;
      await loadSongAndCover(newIndex, false);
      break;
    case 'ArrowLeft':
      newIndex = (currentIndex - 2 + batchQuantity) % batchQuantity + 1;
      await loadSongAndCover(newIndex, false);
      break;
    case 'ArrowUp':
      newIndex = (currentIndex - 11 + batchQuantity) % batchQuantity + 1;
      await loadSongAndCover(newIndex, false);
      break;
    case 'ArrowDown':
      newIndex = (currentIndex + 9) % batchQuantity + 1;
      await loadSongAndCover(newIndex, false);
      break;
    case 'Shift':
      player.reverse = !player.reverse;
      break;
  }
}

function pad(num, size) {
  return ('000' + num).slice(-size);
}

window.onload = setup;
