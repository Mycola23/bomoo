"use strict";
const recorBtn = document.querySelector(".record-btn");
const playback = document.querySelector(".main__playback");

recorBtn.addEventListener("click", toggleRecord);

let can_record = false;
let is_recording = false;

let recorder = null;
let chunks = [];

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
    recorder.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioUrl = window.URL.createObjectURL(blob);
        playback.src = audioUrl;
    };
    can_record = true;
}

function toggleRecord() {
    if (!can_record) return;
    is_recording = !is_recording;
    if (is_recording) {
        recorder.start();
        recorBtn.classList.add("__active");
    } else {
        recorder.stop();
        recorBtn.classList.remove("__active");
    }
}
/* special text for fixing all */

////jjj
