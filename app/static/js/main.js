/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var snapshotButton = document.querySelector('button#snapshot');
// var filterSelect = document.querySelector('select#filter');

// Put variables in global scope to make them available to the browser console.
var video = window.video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;

snapshotButton.onclick = function() {
  canvas.className = 'none';
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  var image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');
  image.setAttribute('crossDomain', true)
  image.onload = function () {
	  console.log(canvas.height - image.height);
	  context.globalAlpha = 0.5;
	  context.drawImage(image, 0, 152, canvas.width, canvas.height);
  };
  image.src = "/shareme/image/footabll-score-clipart-1.jpg";
  
};

var constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
