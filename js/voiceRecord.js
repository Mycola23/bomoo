"use strict";
const recorBtn = document.querySelector(".record-box__record-btn");
const playback = document.querySelector(".record-box__playback");

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
                audioUrlForVoiceMenu = audioUrl;

                //console.log(audioUrlForVoiceMenu);
                resolve(audioUrlForVoiceMenu);
            };
        }).then((audioUrlForVoiceMenu) => {
            CreateVoiceMenu(audioUrlForVoiceMenu);
            console.log("created voice menu ");
        });
    }
}

function CreateVoiceMenu(audioUrl) {
    let HTML = "";
    console.log(audioUrl); // we have our url of audio , now we can create menu for it
}
