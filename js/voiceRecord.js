"use strict";
const recorBtn = document.querySelector(".record-box__record-btn");
const playback = document.querySelector(".record-box__playback");
const controlsBox = document.querySelector(".record-audio");
const audio = document.querySelector(".record-box__playback");
const playPauseBtn = document.querySelector(".record-controls__play-btn");
const volumeBar = document.querySelector(".record-audio__volume-bar");
const musicSeekBar = document.querySelector(".record-audio__seek-bar-mus");
const currentTime = document.querySelector(".record-audio__current-time");
const durationTime = document.querySelector(".record-audio__duration-time");
let can_record = false;
let is_recording = false;
let recorder = null;
let chunks = [];
let audioUrlForVoiceMenu;
//*complete i need understand critical sizes for audio on different devices, think about active memore of device(to 4 gb max=2 for us)
// quality of sound not bad like for not proffesional record machine
// todo discover more about blob , api like
//* solved problem with promise(after second record i just createed else one adeventlistener => on one click was two clicks)
recorBtn.addEventListener("click", toggleRecord);

function setupAudio() {
    console.log("yes setup is successful");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
            })
            .then(setupStream)
            .catch((err) => {
                console.error(err);
            });
    }
}
setupAudio();

function setupStream(stream) {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        chunks.push(e.data);
    };

    can_record = true;
}
let startTimer = null;
let durationTimer = null;
let controlsInitialized = false;

function toggleRecord() {
    if (!can_record) return;
    is_recording = !is_recording;
    if (is_recording) {
        chunks = [];
        startTimer = performance.now();
        recorder.start();
        recorBtn.classList.add("is-recording");
    } else {
        durationTimer = (performance.now() - startTimer) / 1000; // calc time of voice record
        recorder.stop();
        recorBtn.classList.remove("is-recording");
        new Promise((resolve) => {
            recorder.onstop = (e) => {
                console.time("Audio File Generation Time");
                let blob = new Blob(chunks, { type: "audio/mp3; codecs=mp3" });
                chunks = [];
                let audioUrl = window.URL.createObjectURL(blob);
                audio.src = audioUrl;
                console.timeEnd("Audio File Generation Time");
                resolve(audio.src);
            };
        }).then((audioUrlForVoiceMenu) => {
            setTimeout(() => {
                activeAudioControls(audioUrlForVoiceMenu);
                musicSeekBar.max = Math.floor(durationTimer);
                durationTime.innerText = formatTime(durationTimer);
                console.log("created voice menu ");
            }, 350);
        });
    }
}
function activeAudioControls(audioUrl) {
    if (controlsInitialized) return;
    controlsInitialized = true;
    controlsBox.addEventListener("click", (e) => {
        let target = e.target;
        if (audio.paused) {
            if (target.closest(".record-controls__play-btn span") || target.closest(".record-controls__play-btn")) {
                playPauseBtn.classList.remove("pause");
                audio.play();
                console.log("Audio is playing ...");
            }
        } else {
            audio.pause();
            playPauseBtn.classList.add("pause");
            console.log("paused");
        }
    });
    volumeBar.addEventListener("input", () => {
        audio.volume = volumeBar.value;
    });
}
audio.addEventListener("ended", () => {
    playPauseBtn.classList.add("pause");
    musicSeekBar.value = 0;
    currentTime.innerText = formatTime(0);
});
audio.addEventListener("timeupdate", showCurrentTime);
let formatTime = (time) => {
    let min = Math.floor(time / 60);
    if (min < 10) {
        min = `0${min}`;
    }
    let sec = Math.floor(time % 60);
    if (sec < 10) {
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
};

function showCurrentTime() {
    musicSeekBar.value = audio.currentTime;
    currentTime.innerText = formatTime(audio.currentTime);
}

//*maybe a fixed the main problem with palying audio,but this isn`t 100 %
//todo refactoring code
//отже я маю трабли з кнопкою запуску і паузи якщо їх вирішити + налштувати гучність = вийде непоганий диктафон
//^(almost) todo write a timer  for recording voice => use it for show duration
//todo add btn to download voice record
//todo make code look more beautiful and clear
//work code check it ,and change own
/*
"use strict";

const recorBtn = document.querySelector(".record-box__record-btn");
const playback = document.querySelector(".record-box__playback");
const controlsBox = document.querySelector(".record-audio");
const audio = document.querySelector(".record-box__playback");
const playPauseBtn = document.querySelector(".record-controls__play-btn");
const volumeBar = document.querySelector(".record-audio__volume-bar");
const musicSeekBar = document.querySelector(".record-audio__seek-bar-mus");
const currentTime = document.querySelector(".record-audio__current-time");
const durationTime = document.querySelector(".record-audio__duration-time");

let can_record = false;
let is_recording = false;
let is_play = false;
let recorder = null;
let chunks = [];
let audioBlob = null;
let startTimer = null;

// Setup audio recording
function setupAudio() {
    console.log("Yes, setup is successful");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(setupStream)
            .catch((err) => {
                console.error(err);
            });
    }
}

function setupStream(stream) {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        chunks.push(e.data);
    };

    recorder.onstop = () => {
        audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioUrl = window.URL.createObjectURL(audioBlob);
        audio.src = audioUrl;
        musicSeekBar.max = Math.floor(audio.duration);
        console.log("Recording stopped and audio is ready.");
    };

    can_record = true;
}

// Toggle recording
function toggleRecord() {
    if (!can_record) return;

    if (is_recording) {
        recorder.stop();
        recorBtn.classList.remove("is-recording");
        console.log("Recording stopped.");
    } else {
        chunks = [];
        recorder.start();
        recorBtn.classList.add("is-recording");
        console.log("Recording started.");
    }
    is_recording = !is_recording;
}

// Control playback
function controlPlayback() {
    if (!audio.src) {
        console.error("No audio source available for playback.");
        return;
    }

    if (is_play) {
        audio.pause();
        playPauseBtn.classList.add("pause");
        console.log("Paused.");
    } else {
        audio.play();
        playPauseBtn.classList.remove("pause");
        console.log("Playing audio...");
    }

    is_play = !is_play;
}

// Update audio seek and volume
function updateAudioControls() {
    volumeBar.addEventListener("input", () => {
        audio.volume = volumeBar.value / 100;
    });

    musicSeekBar.addEventListener("input", () => {
        audio.currentTime = musicSeekBar.value;
    });

    audio.addEventListener("timeupdate", () => {
        musicSeekBar.value = audio.currentTime;
        currentTime.innerText = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
        is_play = false;
        playPauseBtn.classList.add("pause");
        console.log("Audio playback ended.");
    });
}

// Format time helper
function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${minutes}:${seconds}`;
}

// Event listeners
recorBtn.addEventListener("click", toggleRecord);
playPauseBtn.addEventListener("click", controlPlayback);

// Initialize audio controls
setupAudio();
updateAudioControls();

*/
