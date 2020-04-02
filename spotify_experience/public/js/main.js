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

var domColor, domName, heightProportion, fixHeight = 800;
var frames = [];

var tooltip = document.createElement("a");
var textnode = document.createTextNode("I feel more like this");
tooltip.className = "tooltiptext";
tooltip.appendChild(textnode); 

document.getElementById('blue').style.background = checkAura("blue").color;
document.getElementById('red').style.background = checkAura("red").color;
document.getElementById('green').style.background = checkAura("green").color;
document.getElementById('yellow').style.background = checkAura("yellow").color;

document.getElementById('blueAura').textContent = checkAura("blue").name; 
document.getElementById('redAura').textContent = checkAura("red").name;
document.getElementById('greenAura').textContent = checkAura("green").name;
document.getElementById('yellowAura').textContent = checkAura("yellow").name;

document.getElementById("blueAura").appendChild(tooltip.cloneNode(true)); 
document.getElementById("redAura").appendChild(tooltip.cloneNode(true)); 
document.getElementById("greenAura").appendChild(tooltip.cloneNode(true)); 
document.getElementById("yellowAura").appendChild(tooltip.cloneNode(true));   

function orderFrame(){
  frames = [];
  frames.push(new Frame(20, 5, 300, 350, dom1, canvasDom1));
  frames.push(new Frame(370, 20, 250, 220, dom2, canvasDom2));
  frames.push(new Frame(250, 280, 180, 200, dom3, canvasDom3));
  frames.push(new Frame(470, 300, 180, 130, dom4, canvasDom4));
}

function drawNavBar(){
  document.getElementById('blueAura').style.height = fixHeight * checkDominance("blue") +"px";
  document.getElementById('redAura').style.height = fixHeight * checkDominance("red") +"px";
  document.getElementById('greenAura').style.height = fixHeight * checkDominance("green") +"px";
  document.getElementById('yellowAura').style.height = fixHeight * checkDominance("yellow") +"px";
}

/*
    var captureIcon = new Image();
    captureIcon.src = 'images/capture.png'; 
    ctx.globalAlpha = 1;
    ctx.drawImage(captureIcon, 5, 5);
  */

function checkDominance(color){
  var position = frames.findIndex(x => x.fill === color);

  if (position == 0) heightProportion = 0.45;
  else if (position == 1) heightProportion = 0.24;
  else if (position == 2) heightProportion = 0.18;
  else heightProportion = 0.13;

  return heightProportion;
}

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
    domName = 'Thoughtful';
  }
  else if (color == "yellow"){
    domColor = '#FCD440';
    domName = 'Energetic';
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

  setTimeout(orderFrame, 1000);
  setTimeout(initiateMiniCanvas, 1000);
  setTimeout(drawNavBar, 1000);

  setInterval(blendMiniCanvas, 8000, 0);
  setInterval(blendMiniCanvas, 5000, 1);
  setInterval(blendMiniCanvas, 3000, 2);
  setInterval(blendMiniCanvas, 1000, 3);
  
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



