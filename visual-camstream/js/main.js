/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');
const canvas = window.canvas = document.getElementById('canvasMain');
const ctx = canvas.getContext('2d');

canvas.width = video.videoWidth;  
canvas.height = video.videoHeight;

const canvasDom1 = document.getElementById('canvasDom1');
const canvasDom2 = document.getElementById('canvasDom2');
const canvasDom3 = document.getElementById('canvasDom3');
const canvasDom4 = document.getElementById('canvasDom4');

var domColor, domName, fixHeight = 745;

document.getElementById('dom1Aura').style.height = fixHeight * 0.35 +"px";
document.getElementById('dom2Aura').style.height = fixHeight * 0.3 +"px";
document.getElementById('dom3Aura').style.height = fixHeight * 0.2 +"px";
document.getElementById('dom4Aura').style.height = fixHeight * 0.15 +"px";

var tooltip = document.createElement("a");
var textnode = document.createTextNode("I feel more like this");
tooltip.className = "tooltiptext";
tooltip.appendChild(textnode); 

function drawNavBar(){
  console.log(dom1, dom2, dom3, dom4);
  document.getElementById('dom1').style.background = checkAura(dom1).color;
  document.getElementById('dom2').style.background = checkAura(dom2).color;
  document.getElementById('dom3').style.background = checkAura(dom3).color;
  document.getElementById('dom4').style.background = checkAura(dom4).color;
  
  document.getElementById('dom1Aura').textContent = checkAura(dom1).name; 
  document.getElementById('dom2Aura').textContent = checkAura(dom2).name;
  document.getElementById('dom3Aura').textContent = checkAura(dom3).name;
  document.getElementById('dom4Aura').textContent = checkAura(dom4).name;

  document.getElementById("dom1Aura").appendChild(tooltip.cloneNode(true)); 
  document.getElementById("dom2Aura").appendChild(tooltip.cloneNode(true)); 
  document.getElementById("dom3Aura").appendChild(tooltip.cloneNode(true)); 
  document.getElementById("dom4Aura").appendChild(tooltip.cloneNode(true));   
}

/*
    var captureIcon = new Image();
    captureIcon.src = 'images/capture.png'; 
    ctx.globalAlpha = 1;
    ctx.drawImage(captureIcon, 5, 5);
  */

function checkAura(color){

  var Auras = {};

  if (color == "blue"){
    domColor = '#001b94';
    domName = 'Melancholic';
  }
  else if (color == "red"){
    domColor = '#720000';
    domName = 'Passionate';
  }
  else if (color == "green"){
    domColor = '#064f40';
    domName = 'Energetic';
  }
  else if (color == "yellow"){
    domColor = '#FCD440';
    domName = 'Thoughtful';
  }

  Auras["color"] = domColor;
  Auras["name"] = domName;

  return Auras;
}

function Frame(x, y, w, h, fill, miniCanvas) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.fill = fill;
  this.miniCanvas = miniCanvas;
}

var frames = [];
frames.push(new Frame(0, 0, 400, 500, dom1, canvasDom1));
frames.push(new Frame(400, 0, 350, 300, dom2, canvasDom2));
frames.push(new Frame(250, 300, 250, 200, dom3, canvasDom3));
frames.push(new Frame(500, 300, 300, 200, dom4, canvasDom4));

function initiateMiniCanvas(){
  for (var i in frames) {
      var frame = frames[i];

      var cw = frame.miniCanvas.width = frame.w;
      var ch = frame.miniCanvas.height = frame.h;
    
      var miniCtx = frame.miniCanvas.getContext('2d');
      miniCtx.drawImage(video,0,0,cw,ch);    
    }
}

function drawMainCanvas (){
  canvas.width = video.videoWidth;  
  canvas.height = video.videoHeight;
  
  var frames = [];
  frames.push(new Frame(0, 0, 500, 300, dom1, canvasDom1));
  frames.push(new Frame(0, 0, 500, 300, dom2, canvasDom2));
  frames.push(new Frame(0, 0, 500, 300, dom3, canvasDom3));
  frames.push(new Frame(0, 0, 500, 300, dom4, canvasDom4));

  for (var i in frames) {
    var frame = frames[i];

    var miniCtx = frame.miniCanvas.getContext('2d');
    var image = miniCtx.getImageData(0, 0, frame.w, frame.h);
    ctx.putImageData(image, frame.x, frame.y);  
  
    // Create gradient
    var grd = ctx.createRadialGradient(frame.x+175, frame.y+150, 10, frame.x+190, frame.y+160, frame.w*0.6);
    grd.addColorStop(1, frame.fill);
    grd.addColorStop(0, "black");

    // Fill with gradient
    ctx.fillStyle = grd;

    // Set transparency
    ctx.globalAlpha = 0.6;
    ctx.fillRect(frame.x, frame.y, frame.w, frame.h);
  }
}

function blendMiniCanvas (dominance){
  var width = frames[dominance].miniCanvas.width;
  var height = frames[dominance].miniCanvas.height;
  var miniCtx = frames[dominance].miniCanvas.getContext('2d');

  var pixels = 4 * width * height;
  var image1 = miniCtx.getImageData(0, 0, width, height);
  var imageData1 = image1.data;

  // Set transparency
  miniCtx.globalAlpha = 0.5;

  miniCtx.drawImage(video, 0, 0, frames[dominance].w, frames[dominance].h);
  var image2 = miniCtx.getImageData(0, 0, width, height);
  var imageData2 = image2.data;
  while (pixels--) {
      imageData1[pixels] = imageData1[pixels] * 0.5 + imageData2[pixels] * 0.5;
  }
  miniCtx.putImageData(image1, 0, 0);  
}

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;

  setTimeout(initiateMiniCanvas, 1000);
  setTimeout(drawNavBar, 1000);

  setInterval(blendMiniCanvas, 1000, 0);
  setInterval(blendMiniCanvas, 3000, 1);
  setInterval(blendMiniCanvas, 5000, 2);
  setInterval(blendMiniCanvas, 8000, 3);
  
  setInterval(drawMainCanvas, 1000);

  /**
  setInterval(captureAura, 7000, "1", "blue");
  setInterval(captureAura, 5000, "2", "red");
  setInterval(captureAura, 9000, "3", "green");
  setInterval(captureAura, 11000, "4", "yellow");
  */

}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

//const captureButton = document.getElementById('capture');
//captureButton.onclick = console.log("Test");



