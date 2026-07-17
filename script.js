const songs = [
  {
    title: "Sunset Drive",
    artist: "Chill Beats",
    src: "songs/song1.mp3",
    cover: "images/cover1.jpg"
  },
  {
    title: "Midnight Vibes",
    artist: "Lo-Fi Studio",
    src: "songs/song2.mp3",
    cover: "images/cover2.jpg"
  },
  {
    title: "Ocean Breeze",
    artist: "Ambient Waves",
    src: "songs/song3.mp3",
    cover: "images/cover3.jpg"
  },
  {
    title: "City Lights",
    artist: "Urban Sound",
    src: "songs/song4.mp3",
    cover: "images/cover4.jpg"
  }
];

const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeSlider = document.getElementById('volume-slider');
const playlistEl = document.getElementById('playlist');

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isAutoplay = true;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  cover.src = song.cover;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  highlightActiveSong(index);
}

function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  cover.classList.add('playing');
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  cover.classList.remove('playing');
}

playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

function nextSong() {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  loadSong(currentSongIndex);
  playSong();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
}

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active-toggle', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isAutoplay = !isAutoplay;
  repeatBtn.classList.toggle('active-toggle', isAutoplay);
});

audio.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audio;
  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

audio.addEventListener('ended', () => {
  if (isAutoplay) {
    nextSong();
  } else {
    pauseSong();
  }
});

function renderPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <div class="song-info">
        <span>${song.title}</span>
        <span>${song.artist}</span>
      </div>
    `;
    li.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function highlightActiveSong(index) {
  document.querySelectorAll('#playlist li').forEach((li, i) => {
    li.classList.toggle('active-song', i === index);
  });
}

renderPlaylist();
loadSong(currentSongIndex);
repeatBtn.classList.add('active-toggle');