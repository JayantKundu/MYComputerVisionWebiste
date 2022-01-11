
console.log("Started")

const selectElement = document.getElementById("videoSource");
let cameraVal = "none";
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('output_canvas');
const frame = canvasElement.getContext('2d');
const fpsElement = document.getElementById("fps_canvas");
const fpsFrame = fpsElement.getContext('2d');
const videoSelect = document.querySelector('select#videoSource');
console.log(videoSelect.value);
const selectors = [videoSelect];
let FPS;
let totalTime;
let endTime;
let startTime = 0;
fpsFrame.font = "30px Arial";
let toChangeSize = false;
let totalFps = 0;
let totalFrames = 0;
let camera;

let imgHeight = 480; //videoElement.height;
let imgWidth = 640; //videoElement.width;

const zValue = 500;

// let toChangeSize = true;
let points;
let freeHand=[];

let isFlippedVideo = false;
let isFlippedFrame = false;



// canvasElement.height = videoElement.videoHeight;
// canvasElement.width = videoElement.videoWidth;


// videoElement.style.cssText = "-moz-transform: scale(-1, 1); \
// -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
// transform: scale(-1, 1); filter: FlipH;";

// canvasElement.style.cssText = "-moz-transform: scale(-1, 1); \
// -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
// transform: scale(-1, 1); filter: FlipH;";



function dist(a, b){
    return Math.floor(Math.sqrt(Math.pow((b[0]-a[0]), 2)+Math.pow((b[1]-a[1]), 2)));
}

function onResults(results) {
  // frame.save();
  if(toChangeSize && videoElement.videoWidth!=0 && videoElement.videoHeight!=0){
    toChangeSize = false;
    canvasElement.height = videoElement.videoHeight;
    canvasElement.width = videoElement.videoWidth;

  }
  // canvasElement.height = videoElement.videoHeight;
  // canvasElement.width = videoElement.videoWidth;
  // frame.scale(-1,1);
  points=[];
  frame.clearRect(0, 0, canvasElement.width, canvasElement.height);
  frame.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  fpsFrame.clearRect(0, 0, 100, 50);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      for(let i=0;i<21;i++){
          points.push([Math.floor(landmarks[i].x * imgWidth), Math.floor(landmarks[i].y * imgHeight), Math.floor(landmarks[i].z * zValue)]);
      }
      drawConnectors(frame, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 2});
      drawLandmarks(frame, landmarks, {color: '#FF0000', lineWidth: 1 , radius: 3});
    }
   
  }

  // checking if hand is detected
  // if(points.length>0){
  //   count1++;
  //   // console.log(count1);
  //   // console.log(points)
  //   // checking if it is a free hand draw mode by measuring distance between the index and the thumb
  //   let dist3 = dist(points[0], points[8]);
  //   // if(toPrint){
  //   //     console.log(dist3);
  //   // }
  //   if(dist(points[12]<30 && points[8])<30){
  //       // console.log("YES");
        
  //       freeHand.push(points[8]);
  //       if(freeHand.length==2){
  //           drawing.beginPath();
  //           drawing.strokeStyle = `rgb(255, 0, 0)`;
  //           drawing.moveTo(freeHand[0][0], freeHand[0][1]);
  //           drawing.lineTo(freeHand[1][0], freeHand[1][1]);
  //           drawing.stroke();
  //           freeHand.splice(0, 1);
  //       }
        
  //   }

  //   else{
  //       freeHand=[];
  //   }

    //   console.log(points);
    // drawing.beginPath();
    // drawing.arc(points[8][0], points[8][1], 5, 0, 2 * Math.PI, false);
    // // drawing.arc(100, 100, 5, 0, 2 * Math.PI, false);
    // drawing.fillStyle = 'green';
    // drawing.fill();
    // // drawing.lineWidth = 5;
    // // drawing.strokeStyle = '#003300';
    // drawing.stroke();
  // }
  // frame.drawImage(drawingElement, 0, 0);
  // frame.scale(-1,1);
  endTime = Date.now();
  let totalTime = endTime - startTime;
  startTime = endTime;
  let FPS = Math.floor(1000/totalTime);
  totalFps += FPS;
  totalFrames ++;
  // fpsframe.font = "30px Arial";
  fpsFrame.fillText(FPS.toString(), 10, 50);
}




const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});


hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 0,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);


document.getElementById("avgFPS").addEventListener("click", function(){
  document.getElementById("avgFPS").innerHTML = (Math.floor(totalFps/totalFrames)).toString();
});

document.getElementById("flip_video").addEventListener("click", function(){
  if(isFlippedVideo){
    videoElement.style.cssText = "-moz-transform: scale(-1, 1); \
    -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
    transform: scale(1, 1); filter: FlipH;";
    isFlippedVideo = false;
  }else{
    videoElement.style.cssText = "-moz-transform: scale(-1, 1); \
    -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
    transform: scale(-1, 1); filter: FlipH;";
    isFlippedVideo = true;
  }
});

document.getElementById("flip_frame").addEventListener("click", function(){
  if(isFlippedFrame){
    canvasElement.style.cssText = "-moz-transform: scale(-1, 1); \
    -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
    transform: scale(1, 1); filter: FlipH;";
    isFlippedFrame = false;
  }else{
    canvasElement.style.cssText = "-moz-transform: scale(-1, 1); \
    -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
    transform: scale(-1, 1); filter: FlipH;";
    isFlippedFrame = true;
  }
});



function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function gotDevices(deviceInfos) {
// Handles being called several times to update labels. Preserve values.
console.log("deviceInfos");
console.log(deviceInfos);
const values = selectors.map(select => select.value);

for (let i = 0; i !== deviceInfos.length; ++i) {
  const deviceInfo = deviceInfos[i];
  const option = document.createElement('option');
  option.value = deviceInfo.deviceId;
  if (deviceInfo.kind === 'videoinput') {
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
let a = document.createElement("option");
selectElement.addEventListener(a, selctElement[0]);
selectElement.selectedIndex=0;
}

function waitForIt() {
  console.log("waitForIt fucntion called");
  cameraVal = selectElement.value;
  if (cameraVal == "none") {
    setTimeout(waitForIt,1000);
  } else {
      camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      },
      deviceId: videoSelect.value,
      width: 640,
      height: 480
    });
    camera.start();
    console.log("camera started");
    return;
  }
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);


waitForIt();

console.log("Started 2");
console.log(cameraVal);
