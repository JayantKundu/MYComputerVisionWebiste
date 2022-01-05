

// document.addEventListener('keyup', (e) => {
//     if (e.code === "w")console.log(points);

// });`

// document.addEventListener('keydown', function(event) {
//     const key = event.key; // "a", "1", "Shift", etc.
//     console.log(key);
//     if(key=='s'){
//         console.log(points);
//     }
// });

console.log("Started")

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const frame = canvasElement.getContext('2d');
const drawingElement = document.getElementsByClassName('drawing_canvas')[0];
const drawing = drawingElement.getContext('2d');

// videoElement.msHorizontalMirror = false;
// videoElement.classList.toggle('selfie', options.selfieMode);



videoElement.style.cssText = "-moz-transform: scale(-1, 1); \
-webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
transform: scale(-1, 1); filter: FlipH;";

// canvasElement.style.cssText = "-moz-transform: scale(-1, 1); \
// -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
// transform: scale(-1, 1); filter: FlipH;";

// drawingElement.style.cssText = "-moz-transform: scale(-1, 1); \
// -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
// transform: scale(-1, 1); filter: FlipH;";


const imgHeight = 480; //videoElement.height;
const imgWidth = 640; //videoElement.width;

const zValue = 500;


let points;
let freeHand=[];
let startTime=0;
let endTime;
let count1=0;
function dist(a, b){
    return Math.floor(Math.sqrt(Math.pow((b[0]-a[0]), 2)+Math.pow((b[1]-a[1]), 2)));
}

function onResults(results) {
  // frame.save();
  points=[];
  frame.clearRect(0, 0, canvasElement.width, canvasElement.height);
  frame.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

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

  endTime = Date.now();
  let totalTime = endTime - startTime;
  startTime = endTime;
  let FPS = Math.floor(1000/totalTime);
  frame.font = "30px Arial";
  frame.fillText(FPS.toString(), 10, 50);
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



const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();