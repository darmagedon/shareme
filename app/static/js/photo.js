var sharemei = sharemei || {};
sharemei.photoFunctions = sharemei.photoFunctions || {};
(function(photoFunction) {
	var thumborUrl = "http://localhost:8888/unsafe/fit-in/800x0/";
	var thumborWaterMarkUrl = "http://localhost:8888/unsafe/fit-in/0x100/";
	var baseUrl = location.protocol + "//" + location.host + "/";
	var video = document.getElementById('video');
	var accessToken;
	
	function statusChangeCallback(response) {
	    console.log('statusChangeCallback');
	    accessToken = response.authResponse.accessToken;
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
	      document.getElementById('status').innerHTML =
	        'Thanks for logging in, ' + response.name + '!';
	    });
	  };
	
	
	$.extend(photoFunction, {
		init : function() {
			photoFunction.attachWaterMark();
			photoFunction.addEventHandlers();
			$("textarea").hashtags();
		},
		attachWaterMark : function() {
			var imageUrl = $('.clicked-picture img').data('image-url');
			var watermarkImage = $('.score-overlay img').data('image-url');
			var processedImageUrl = thumborUrl + "filters:watermark("
					+ thumborWaterMarkUrl + watermarkImage + ",320,-10,20)/"
					+ imageUrl;
			$('.clicked-picture img').attr("src", processedImageUrl);
			$('meta[property="og:image"]').attr('content', processedImageUrl);
		},
		addEventHandlers : function() {
			$(document).on('click', '.btn-share-instagram', function(e) {
				e.preventDefault();
				var image = photoFunction.getImageThroughCanvas();
				var tags = $('textarea[name="tags"]').val();
				console.log(accessToken);
				console.log();
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
					if (typeof successCallBack === "function")
						successCallBack(response);
				}).fail(function(error) {
					$(".wrapper").loadingOverlay("remove");
					if (typeof errorCallBack === "function")
						errorCallBack(error);
				});
			});
			$(document).on('click','.snap-photo',function(){
				$('canvas').removeClass('hide');
				var canvas = document.getElementById('canvas');
				var context = canvas.getContext('2d');
				var video = document.getElementById('video');
				context.drawImage(video, 0, 0, 640, 480);
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
		}
	});

	$(document).ready(function() {
		console.log("hello world");
		photoFunction.init();

	});

})(sharemei.photoFunctions);