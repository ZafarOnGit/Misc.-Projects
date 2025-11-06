// UI logic for Mood Analysis Platform

document.addEventListener('DOMContentLoaded', () => {
  // Camera toggle
  const toggleVideo = document.getElementById('toggle-video');
  const video = document.getElementById('video');
  let videoStream = null;

  toggleVideo.addEventListener('change', async (e) => {
    if (e.target.checked) {
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = videoStream;
      } catch (err) {
        alert('Unable to access camera.');
        toggleVideo.checked = false;
      }
    } else {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    }
  });

  // Start camera by default
  toggleVideo.dispatchEvent(new Event('change'));

  // Microphone toggle
  const toggleMic = document.getElementById('toggle-mic');
  const micText = document.getElementById('mic-text');
  let micStream = null;

  toggleMic.addEventListener('change', async (e) => {
    if (e.target.checked) {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micText.textContent = 'Microphone: On';
      } catch (err) {
        alert('Unable to access microphone.');
        toggleMic.checked = false;
        micText.textContent = 'Microphone: Off';
      }
    } else {
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
      }
      micText.textContent = 'Microphone: Off';
    }
  });

  // Start mic by default
  toggleMic.dispatchEvent(new Event('change'));

  // Privacy Policy
  document.getElementById('show-privacy').addEventListener('click', () => {
    alert('All processing is done locally in your browser. No video, audio, or mood data is sent to any server. You can disable camera/mic at any time.');
  });

  // Export Mood Data (placeholder)
  document.getElementById('export-data').addEventListener('click', () => {
    alert('Export functionality coming soon!');
  });
}); 