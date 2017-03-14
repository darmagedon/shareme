/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var snapshotButton = document.querySelector('button#snapshot');

// Put variables in global scope to make them available to the browser console.
var video = window.video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;

var streamConstraints = {
  audio: false,
  video: true
};

snapshotButton.onclick = function() {
  canvas.className = 'none';
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  $('video, .snapshot-btn').addClass('hide');
  $('canvas, .tag-container, .btn-group').removeClass('hide');
  sharemei.photoFunctions.stopStream();
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function startStream(){
  navigator.mediaDevices.getUserMedia(streamConstraints).
      then(handleSuccess).catch(handleError);
}

function imageChanged() {
  var preview = document.querySelector('#image-file');
  var file    = document.querySelector('#file-input').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);

    setTimeout(function() {
      canvas.className = 'none';
      var context = canvas.getContext('2d');

      var image = new Image();
      image.onload = function() {
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          // putImageOverlayOn(context);
      }
      image.src = preview.src;
    }, 500);
  }
}
