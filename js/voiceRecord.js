"use strict";
const recorBtn = document.querySelector(".record-box__record-btn");
const playback = document.querySelector(".record-box__playback");
const controlsBox = document.querySelector(".record-audio");
const audio = document.querySelector(".record-box__playback");
let can_record = false;
let is_recording = false;

let recorder = null;
let chunks = [];
let audioUrlForVoiceMenu;
//todo i need understand critical sizes for audio on different devices, think about active memore of device
// quality of sound not bad like for not proffesional record machine
// todo discover more about blob , api like
//todo solve problem with promise
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

function toggleRecord() {
    if (!can_record) return;
    is_recording = !is_recording;
    if (is_recording) {
        recorder.start();
        recorBtn.classList.add("is-recording");
    } else {
        recorder.stop();
        recorBtn.classList.remove("is-recording");

        new Promise((resolve) => {
            recorder.onstop = (e) => {
                const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                chunks = [];
                const audioUrl = window.URL.createObjectURL(blob);
                playback.src = audioUrl;
                audioUrlForVoiceMenu = window.URL.createObjectURL(blob);

                //console.log(audioUrlForVoiceMenu);
                resolve(audioUrlForVoiceMenu);
            };
        }).then((audioUrlForVoiceMenu) => {
            ControlVoiceRecord(audioUrlForVoiceMenu);
            console.log("created voice menu ");
        });
    }
}

function ControlVoiceRecord(audioUrl) {
    // Set up the audio source
    audio.src = audioUrl;
    audio.load();

    // Listen for button clicks
    controlsBox.addEventListener("click", (e) => {
        const target = e.target;

        if (target.closest(".record-controls__play-btn")) {
            // Toggle the play/pause state
            if (audio.paused) {
                audio.play();
                target.classList.add("pause"); // Update button state
                console.log("Audio playing...");
            } else {
                audio.pause();
                target.classList.remove("pause"); // Update button state
                console.log("Audio paused.");
            }
        }
    });

    // Sync button state with audio events
    audio.addEventListener("play", () => {
        const playBtn = document.querySelector(".record-controls__play-btn");
        if (playBtn) playBtn.classList.add("pause");
    });

    audio.addEventListener("pause", () => {
        const playBtn = document.querySelector(".record-controls__play-btn");
        if (playBtn) playBtn.classList.remove("pause");
    });

    audio.addEventListener("ended", () => {
        const playBtn = document.querySelector(".record-controls__play-btn");
        if (playBtn) playBtn.classList.remove("pause");
        console.log("Audio playback ended.");
    });
}
