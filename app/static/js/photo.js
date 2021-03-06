var sharemei = sharemei || {};
sharemei.photoFunctions = sharemei.photoFunctions || {};

(function(photoFunction) {
	var baseUrl = location.protocol + "//" + location.host + "/";
	var video = document.getElementById('video');
	var defaultTags = "Wow!!! What a game! What is more intense than a nail biter?!?\n\n #UnlimitedBaseball #contest #WorldSeries";

	function statusChangeCallback(response) {
	    console.log('statusChangeCallback');
	    accessToken = response.authResponse.accessToken;
	    $("#access-token").val(response.authResponse.accessToken);
	    console.log(accessToken);
	    // The response object is returned with a status field that lets the
	    // app know the current login status of the person.
	    // Full docs on the response object can be found in the documentation
	    // for FB.getLoginStatus().
	    if (response.status === 'connected') {
	      // Logged into your app and Facebook.
	      testAPI();
	    } else {
	      // The person is not logged into your app or we are unable to tell.
	      document.getElementById('status').innerHTML = 'Please log ' +
	        'into this app.';
	    }
	  }

	  // This function is called when someone finishes with the Login
	  // Button.  See the onlogin handler attached to it in the sample
	  // code below.
	  function checkLoginState() {
	    FB.getLoginStatus(function(response) {
	      statusChangeCallback(response);
	    });
	  }

	  window.fbAsyncInit = function() {
	  FB.init({
	    appId      : '743871909112676',
	    cookie     : true,  // enable cookies to allow the server to access
	                        // the session
	    xfbml      : true,  // parse social plugins on this page
	    version    : 'v2.8' // use graph api version 2.8
	  });

	  // Now that we've initialized the JavaScript SDK, we call
	  // FB.getLoginStatus().  This function gets the state of the
	  // person visiting this page and can return one of three states to
	  // the callback you provide.  They can be:
	  //
	  // 1. Logged into your app ('connected')
	  // 2. Logged into Facebook, but not your app ('not_authorized')
	  // 3. Not logged into Facebook and can't tell if they are logged into
	  //    your app or not.
	  //
	  // These three cases are handled in the callback function.

	  FB.getLoginStatus(function(response) {
	    statusChangeCallback(response);
	  });

	  };

	  // Load the SDK asynchronously
	  (function(d, s, id) {
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) return;
	    js = d.createElement(s); js.id = id;
	    js.src = "//connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	  }(document, 'script', 'facebook-jssdk'));

	  // Here we run a very simple test of the Graph API after login is
	  // successful.  See statusChangeCallback() for when this call is made.
	  function testAPI() {
	    console.log('Welcome!  Fetching your information.... ');
	    FB.api('/me', function(response) {
	    	console.log(response);
	    	console.log(1111, response);
	      console.log('Successful login for: ' + response.name);
	      accessToken = response.accessToken;
	      // document.getElementById('status').innerHTML =
	      //   'Thanks for logging in, ' + response.name + '!';
	    });
	  };

	var isMobile = window.mobilecheck();

	$.extend(photoFunction, {
		init : function() {
			photoFunction.prepareDocument();
			photoFunction.addEventHandlers();
			$("textarea").val(defaultTags);
		},
		prepareDocument: function(){
			if (isMobile) {
					$('.image-capture-button').removeClass('hide');
			} else {
				$('.video-wrapper').removeClass('hide');
				startStream();
			}
			$('video, .snapshot-btn').removeClass('hide');
			$('canvas, .tag-container, .btn-group').addClass('hide');
			$('textarea').val('');
		},
		addEventHandlers : function() {
			$(document).on('click', '.image-capture-button', function(){
					$('input[type="file"]').click();
			});
			$(document).on('change','input[type="file"]', function (){
       		$('.image-capture-button').addClass('hide');
					$('canvas, .tag-container, .btn-group').removeClass('hide');
					photoFunction.getImageFromFile();
					photoFunction.stopStream();
     });
			// $(document).on('click', '#snapshot', function(){
			// 	canvas.className = 'none';
			//   var context = canvas.getContext('2d');
			// 	console.log(canvas.width, canvas.height);
			// 	console.log(video);
			//   context.drawImage(video, 0, 0, canvas.width, canvas.height);
			// 	$('video, .snapshot-btn').addClass('hide');
			// 	$('canvas, .tag-container, .btn-group').removeClass('hide');
			// 	photoFunction.stopStream();
			// });
			$(document).on('click', '.fb-share-link-button', function(e){
				e.preventDefault();
				var dataHref;
				var image = photoFunction.getImageThroughCanvas();
				var data = {
					image: image.src
				};
				$.ajax({
					url : baseUrl + "getsharablelink",
					type : "POST",
					data : data,
					async: false
				}).done(function(response) {
					dataHref = response;
					console.log(dataHref);
					FB.ui({
				    method: 'share',
				    display: 'popup',
              				 mobile_iframe: true,
				    href: dataHref
				  }, function(response){
						console.log(response);
					});
				}).fail(function(error) {
					if (typeof errorCallBack === "function")
						errorCallBack(error);
				});
			});
			$(document).on('click', '.btn-share-instagram', function(e) {
				e.preventDefault();
				console.log(accessToken);
				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {
							photoFunction.publishToFacebook();
			    } else {
						console.log("logged out");
						FB.login(function(response) {
							$("#access-token").val(response.authResponse.accessToken);
							if (response.authResponse.grantedScopes.includes('publish_actions')) {
								photoFunction.publishToFacebook();
							}
						}, {
								scope: 'public_profile,email,publish_actions',
								return_scopes: true
						});
					}
			  }, true);
			});
			$(document).on('click','.snap-photo',function(){
				$('canvas').removeClass('hide');
				var canvas = document.getElementById('canvas');
				var context = canvas.getContext('2d');
				var video = document.getElementById('video');
				context.drawImage(video, 0, 0, 640, 480);
			});
		},
		publishToFacebook : function(){
			var accessToken = $("#access-token").val();
			var image = photoFunction.getImageThroughCanvas();
			var tags = $('textarea[name="tags"]').val();
			var data = {
				tags: tags,
				image: image.src,
				accessToken: accessToken
			};
			$(".wrapper").loadingOverlay();
			$.ajax({
				url : baseUrl + "photo",
				type : "POST",
				data : data
			}).done(function(response) {
				$(".wrapper").loadingOverlay("remove");
				$('.share-response-success ').removeClass('hide');
				if (typeof successCallBack === "function")
					successCallBack(response);
			}).fail(function(error) {
				$('.share-response-fail').removeClass('hide');
				$(".wrapper").loadingOverlay("remove");
				if (typeof errorCallBack === "function")
					errorCallBack(error);
			});
		},
		getImageThroughUrl : function(imageUrl) {
			var img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');
			img.setAttribute('crossDomain', true)
			img.src = imageUrl;
			return img;
		},
		getImageThroughCanvas : function (){
			var image = new Image();
			image.src = canvas.toDataURL("image/png");
			return image;
		},
		getImageFromFile : function(){
			imageChanged();
		},
		stopStream : function(){
			if(window.stream != null && window.stream != undefined )
					window.stream.getTracks().forEach( (track) => {
							track.stop();
					});
		},
		startStream : function(){
			console.log(streamConstraints);
			startStream();
		}
	});

	$(document).ready(function() {
		photoFunction.init();
	});

})(sharemei.photoFunctions);
