const timerButton = document.getElementById("timer");
const stopButton = document.getElementById("stop");
const timerCounter = document.getElementById("counter");
const minutesSelect = document.getElementById("minutes");
const secondsSelect = document.getElementById("seconds");
const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
console.log(radius);
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

let interval;
let minuteAlertInterval;
let totalTime;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function setTimeOptions() {
  let count = 0;
  while (minutesSelect.childElementCount <= 59) {
    const minOpt = document.createElement("option");
    const secOpt = document.createElement("option");
    minOpt.textContent = count;
    secOpt.textContent = count;
    minutesSelect.appendChild(minOpt);
    secondsSelect.appendChild(secOpt);
    count++;
  }
}
setTimeOptions();

const tensMinElem = document.getElementById("tens-min");
const minElem = document.getElementById("min");
const tensSecElem = document.getElementById("tens-sec");
const secElem = document.getElementById("sec");

timerButton.onclick = () => {
  if (interval) {
    clearInterval(interval);
  }
  if (minuteAlertInterval) {
    clearInterval(minuteAlertInterval);
  }
  totalTime = minutesSelect.value * 60 * 1000 + secondsSelect.value * 1000;

  startTimer(totalTime);
  startMinuteAlert(totalTime);
  toggleButtons(true);
};
stopButton.onclick = () => {
  clearInterval(interval);
  clearInterval(minuteAlertInterval);
  clearTimer();
  toggleButtons(false);
};
function startTimer(time) {
  const end = Date.now() + time;

  interval = setInterval(() => {
    const now = Date.now();
    const delta = end - now;
    if (delta < 0) {
      clearInterval(interval);
      clearInterval(minuteAlertInterval);
      clearTimer();
      toggleButtons(false);
      return;
    }

    const minutes = Math.floor((delta / 1000 / 60) % 60);
    const seconds = Math.floor((delta / 1000) % 60);

    setTimer({
      tensMin: Math.floor(minutes / 10),
      min: minutes % 10,
      tensSec: Math.floor(seconds / 10),
      sec: seconds % 10,
    });
    const percentPassed = ((totalTime - delta) / totalTime) * 100;
    setProgress(percentPassed);
  }, 100);
}
function startMinuteAlert(time) {
  let minutesLeft = Math.floor(time / 60000);
  minuteAlertInterval = setInterval(() => {
    if (minutesLeft > 0) {
      alert("На 1 минуту стало меньше!");
      minutesLeft--;
    } else {
      clearInterval(minuteAlertInterval);
    }
  }, 60000);
}
function setTimer({ tensMin, min, tensSec, sec }) {
  tensMinElem.innerText = tensMin;
  minElem.innerText = min;
  tensSecElem.innerText = tensSec;
  secElem.innerText = sec;
}
function clearTimer() {
  setTimer({
    tensMin: 0,
    min: 0,
    tensSec: 0,
    sec: 0,
  });
  setProgress(0);
}
function toggleButtons(isRunning) {
  timerButton.disabled = isRunning;
  stopButton.disabled = !isRunning;
}
toggleButtons(false);
