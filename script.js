'use strict';

//Find out how to close setting when clicking beside
//Convert to hours if hours

//TODO: Insert sounds

const DEFAULT_TIME = 10; // 20 min
const DEFAULT_BREAK_TIME = 20; // 20 sec
const STROKE_DASH_OFFSET = 1207;

const state = {
  countdown: '', // Variable to store setInterval
  // In seconds:
  screenTime: DEFAULT_TIME,
  breakTime: DEFAULT_BREAK_TIME,
  currentTime: DEFAULT_TIME,
  isScreenTime: true,
  sound: '_',
};

const timerElement = document.querySelector('.timer__time-left');
const settingsElement = document.querySelector('.settings');
const stopBtn = document.querySelector('#stop');
const playBtn = document.querySelector('#play');
const pauseBtn = document.querySelector('#pause');
const settingsBtn = document.querySelector('#settings');
const saveBtn = document.querySelector('#save');
const minInput = document.querySelector('#min-input');
const secInput = document.querySelector('#sec-input');
const minSpan = document.querySelector('#min-span');
const secSpan = document.querySelector('#sec-span');
const circleElement = document.querySelector('.circle');
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

//// FUNCTIONS ////

const timer = function (seconds) {
  clearInterval(state.countdown);
  const now = Date.now();
  const total = now + seconds * 1000;
  displayTimeLeft(seconds);

  state.countdown = setInterval(() => {
    const secondsLeft = Math.round((total - Date.now()) / 1000);
    if (secondsLeft < 0) {
      clearInterval(state.countdown);
      console.log('alarm');

      state.isScreenTime = !state.isScreenTime;
      // Alternate between screen time and break time
      state.isScreenTime ? timer(state.screenTime) : timer(state.breakTime);
      // Change colors
      state.isScreenTime
        ? changeColors(screenColor, screenColorDark, screenColorLight)
        : changeColors(breakColor, breakColorDark, breakColorLight);

      // Reset circle
      circleElement.style.strokeDashoffset = 0;
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
  //   document.title = display;
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
  settingsElement.classList.toggle('hidden');
};

const calculateStroke = function (time) {
  circleElement.style.strokeDashoffset =
    +circleElement.style.strokeDashoffset + STROKE_DASH_OFFSET / time;
};

const changeColors = function (main, dark, light) {
  document.documentElement.style.setProperty('--color-main', main);
  document.documentElement.style.setProperty('--color-main-dark', dark);
  document.documentElement.style.setProperty('--color-main-light', light);
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

minInput.addEventListener(
  'input',
  () => (minSpan.textContent = minInput.value)
);
secInput.addEventListener(
  'input',
  () => (secSpan.textContent = secInput.value)
);
