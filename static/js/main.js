
const videoElement = document.querySelector('video');
const audioInputSelect = document.querySelector('select#audioSource');
const audioOutputSelect = document.querySelector('select#audioOutput');
const videoSelect = document.querySelector('select#videoSource');
const selectors = [audioInputSelect, audioOutputSelect, videoSelect];
const canvasElement = document.getElementById("output_canvas");
let frame = canvasElement.getContext("2d");

let FPS;
let totalTime;
let endTime;
let startTime = 0;
frame.font = "30px Arial";
let toChangeSize = false;
let totalFps = 0;
let totalFrames = 0;



function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
      audioInputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
      audioOutputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
// function attachSinkId(element, sinkId) {
//   if (typeof element.sinkId !== 'undefined') {
//     element.setSinkId(sinkId)
//         .then(() => {
//           console.log(`Success, audio output device attached: ${sinkId}`);
//         })
//         .catch(error => {
//           let errorMessage = error;
//           if (error.name === 'SecurityError') {
//             errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
//           }
//           console.error(errorMessage);
//           // Jump back to first output device in the list as it's the default.
//           audioOutputSelect.selectedIndex = 0;
//         });
//   } else {
//     console.warn('Browser does not support output device selection.');
//   }
// }

// function changeAudioDestination() {
//   const audioDestination = audioOutputSelect.value;
//   attachSinkId(videoElement, audioDestination);
// }

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = videoSelect.value;
  const constraints = {
    // audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

// audioInputSelect.onchange = start;
// audioOutputSelect.onchange = changeAudioDestination;

videoSelect.onchange = start;

start();

let buttonElement = document.getElementById("avgFPS");
buttonElement.addEventListener("click", function(){
  buttonElement.innerHTML = (Math.floor(totalFps/totalFrames)).toString();
});

function drawOnCanvas(){
  // console.log("yes drawing");
  frame.clearRect(0, 0, 640, 480);
  frame.drawImage(videoElement,0, 0, 640, 480);
  endTime = Date.now();
  let totalTime = endTime - startTime;
  startTime = endTime;
  let FPS = Math.floor(1000/totalTime);
  totalFps += FPS;
  totalFrames ++;
  frame.fillText(FPS.toString(), 10, 50);
  setTimeout(drawOnCanvas, 0);
}


setTimeout(drawOnCanvas, 0);
