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
const canvas = window.canvas = document.querySelector('canvas');
canvas.width = video.width;
canvas.height = video.height;

function captureAura(dominance, color){
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  var posX, posY, drawWidth, drawHeight, clipX, clipY;

  if (dominance == "1") {
    posX = 0;
    posY = 0; 
    drawWidth = 300;
    drawHeight = video.videoHeight;
    clipX = 90;
    clipY = 0; 
  }
  else if (dominance == "2") {
    posX = 500;
    posY = 0;  
    drawWidth = 300;
    drawHeight = 300; 
    clipX = 90;
    clipY = 130; 
  }

  else if (dominance == "3") {
    posX = 100;
    posY = 200;  
    drawWidth = 200;
    drawHeight = 200; 
    clipX = 90;
    clipY = 130; 
  }

  else if (dominance == "4") {
    posX = -0;
    posY = 200;  
    drawWidth = 100;
    drawHeight = 100; 
    clipX = 90;
    clipY = 130; 
  }

  ctx.drawImage(video,clipY,clipY,drawWidth,drawHeight,posX,posY,drawWidth,drawHeight);
  ctx.globalAlpha = 0.7;
  ctx.fillRect(posX,posY,drawWidth,drawHeight);
}

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;

  setInterval(captureAura, 3000, "2", "#a02121");
  setInterval(captureAura, 4000, "1", "blue");
  setInterval(captureAura, 5000, "3", "green");
  setInterval(captureAura, 7000, "4", "yellow");
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

const button = document.querySelector('button');
//button.onclick = capture();



