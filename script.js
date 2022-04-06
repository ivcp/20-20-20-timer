'use strict';

const DEFAULT_TIME = 1200; // 20 min
const DEFAULT_BREAK_TIME = 20; // 20 sec
const STROKE_DASH_OFFSET = 1207;

const state = {
  countdown: '', // Variable to store setInterval
  screenTime: DEFAULT_TIME,
  breakTime: DEFAULT_BREAK_TIME,
  currentTime: DEFAULT_TIME,
  isScreenTime: true,
  sound: 'sound-1',
};
const timerElement = document.querySelector('.timer__time-left');
const settingsElement = document.querySelector('.settings');
const stopBtn = document.querySelector('#stop');
const playBtn = document.querySelector('#play');
const pauseBtn = document.querySelector('#pause');
const settingsBtn = document.querySelector('#settings');
const saveBtn = document.querySelector('#save');
const closeBtn = document.querySelector('#close');
const minInput = document.querySelector('#min-input');
const secInput = document.querySelector('#sec-input');
const minSpan = document.querySelector('#min-span');
const secSpan = document.querySelector('#sec-span');
const circleElement = document.querySelector('.circle');
const soundDropdown = document.querySelector('.settings__sound-drop');
const sounds = document.querySelectorAll('audio');
const screenColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-screen')
  .trim();
const screenColorDark = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-screen-dark')
  .trim();
const screenColorLight = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-screen-light')
  .trim();
const breakColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-break')
  .trim();
const breakColorDark = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-break-dark')
  .trim();
const breakColorLight = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-break-light')
  .trim();
const defaultTitle = document.title;

//// FUNCTIONS ////

const timer = function (seconds) {
  clearInterval(state.countdown);
  const now = Date.now();
  const total = now + seconds * 1000;
  displayTimeLeft(seconds);
  state.isScreenTime ? setTitle('Work') : setTitle('Look away');
  state.countdown = setInterval(() => {
    const secondsLeft = Math.round((total - Date.now()) / 1000);
    if (secondsLeft < 0) {
      clearInterval(state.countdown);
      // Alternate between screen time and break time
      state.isScreenTime = !state.isScreenTime;
      if (state.isScreenTime) {
        timer(state.screenTime);
        changeColors(screenColor, screenColorDark, screenColorLight);
      } else {
        timer(state.breakTime);
        changeColors(breakColor, breakColorDark, breakColorLight);
      }
      // Reset circle
      circleElement.style.strokeDashoffset = 0;
      // Play sound
      document.getElementById(`${state.sound}`).play();
      return;
    }
    displayTimeLeft(secondsLeft);
    state.currentTime = secondsLeft;
    // Animate the circle
    state.isScreenTime
      ? calculateStroke(state.screenTime)
      : calculateStroke(state.breakTime);
  }, 1000);
};

const displayTimeLeft = function (seconds) {
  const min = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${min < 10 ? '0' : ''}${min}:${
    remainderSeconds < 10 ? '0' : ''
  }${remainderSeconds}`;
  timerElement.textContent = display;
};

const startTimer = function () {
  togglePlayPause();
  timer(state.currentTime);
};

const stopTimer = function () {
  state.currentTime = state.screenTime;
  clearInterval(state.countdown);
  displayTimeLeft(state.screenTime);
  state.isScreenTime = true;
  circleElement.style.strokeDashoffset = 0;
  changeColors(screenColor, screenColorDark, screenColorLight);
  document.title = defaultTitle;
  playBtn.classList.remove('hidden');
  pauseBtn.classList.add('hidden');
};

const pauseTimer = function () {
  clearInterval(state.countdown);
  togglePlayPause();
};

const togglePlayPause = function () {
  playBtn.classList.toggle('hidden');
  pauseBtn.classList.toggle('hidden');
};

const handleInput = function () {
  const { value: min } = minInput;
  const { value: sec } = secInput;
  state.screenTime = +min * 60;
  state.breakTime = +sec;
  stopTimer();
  state.sound = soundDropdown.value;
  settingsElement.classList.toggle('hidden');
};

const calculateStroke = function (time) {
  const offset =
    +circleElement.style.strokeDashoffset.replace('px', '') +
    STROKE_DASH_OFFSET / time;
  circleElement.style.strokeDashoffset = `${offset}px`;
};

const changeColors = function (main, dark, light) {
  document.documentElement.style.setProperty('--color-main', main);
  document.documentElement.style.setProperty('--color-main-dark', dark);
  document.documentElement.style.setProperty('--color-main-light', light);
};

const previewSound = function (e) {
  sounds.forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });
  document.getElementById(`${e.target.value}`).play();
};

const setTitle = function (mode) {
  document.title = `${mode} ${mode === 'Work' ? '💻' : '👀'} ${defaultTitle}`;
};

////    EVENT LISTENERS    ////

window.addEventListener('load', () => {
  displayTimeLeft(state.screenTime);
});
playBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
pauseBtn.addEventListener('click', pauseTimer);
settingsBtn.addEventListener('click', () => {
  settingsElement.classList.toggle('hidden');
});
saveBtn.addEventListener('click', handleInput);
closeBtn.addEventListener('click', () =>
  settingsElement.classList.toggle('hidden')
);
minInput.addEventListener(
  'input',
  () => (minSpan.textContent = minInput.value)
);
secInput.addEventListener(
  'input',
  () => (secSpan.textContent = secInput.value)
);
soundDropdown.addEventListener('change', previewSound);
