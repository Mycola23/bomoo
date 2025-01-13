const playPauseButton = document.querySelector(".custom-audio__play-pause");
const playIcon = playPauseButton.querySelector(".play-icon");
const pauseIcon = playPauseButton.querySelector(".pause-icon");
const audioElement = document.querySelector("audio");
const seekBar = document.querySelector(".custom-audio__seek-bar");
const timeDisplay = document.querySelector(".custom-audio__time");
const volumeControl = document.querySelector(".custom-audio__volume");

let isPlaying = false; // Track play/pause state

// Toggle play/pause functionality
playPauseButton.addEventListener("click", () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
        audioElement.play(); // Play the audio
        playIcon.style.display = "none";
        pauseIcon.style.display = "flex";
    } else {
        audioElement.pause(); // Pause the audio
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    }
});

// Update seek bar and time during playback
audioElement.addEventListener("timeupdate", () => {
    seekBar.value = audioElement.currentTime;
    seekBar.max = audioElement.duration || 1; // Set the max value dynamically based on duration

    const currentTime = formatTime(audioElement.currentTime);
    const duration = formatTime(audioElement.duration);
    timeDisplay.textContent = `${currentTime} / ${duration}`;
});

// Seek functionality
seekBar.addEventListener("input", () => {
    audioElement.currentTime = seekBar.value; // Set the audio position based on seek bar
});

// Reset to the start at the end of the song
audioElement.addEventListener("ended", () => {
    isPlaying = false; // Set play state to false
    audioElement.currentTime = 0; // Reset playback position to start
    playIcon.style.display = "block"; // Show play icon
    pauseIcon.style.display = "none"; // Hide pause icon
});

// Format time for display
function formatTime(time) {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value; // Adjust the audio volume
});
