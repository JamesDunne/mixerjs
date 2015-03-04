"use strict";

var audiofiles = [
	"15 - Bullet with Butterfly Wings - Drums.wav",
	"15 - Bullet with Butterfly Wings - Bass.wav",
	"15 - Bullet with Butterfly Wings - Gtr MG.wav",
	"15 - Bullet with Butterfly Wings - Gtr JD.wav",
	"15 - Bullet with Butterfly Wings - Vox MG.wav",
	"15 - Bullet with Butterfly Wings - Vox JD.wav"
];

// Future-proofing...
var context;
if (typeof AudioContext !== "undefined") {
    context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
    context = new webkitAudioContext();
} else {
	throw "Fuck you";
}

var audioSources = [];

function attemptStart() {
	if (audioSources.length < audiofiles.length) return;

	startAll();
}

function startAll() {
	var i;
	for (i = 0; i < audioSources.length; i++) {
		audioSources[i].mediaElement.play(0);
	}	
}

function stopAll() {
	var i;
	for (i = 0; i < audioSources.length; i++) {
		audioSources[i].mediaElement.pause();
	}	
}

function reloadErrored() {
	var i;
	for (i = 0; i < audioSources.length; i++) {
		var i;
		var audio = audioSources[i];
		console.log(audio.error);
		if (audio.error != undefined) {
			console.log("load for %s", audio.src);
			audio.load();
		}
	}
}

(function() {
	var i;
	for (i = 0; i < audiofiles.length; i++) {
		(function() {
			var af = audiofiles[i];
			var audio = new Audio();
			audio.setAttribute("src", "audio/" + af);
			// Wait for the src to become ready:
			// or 'canplaythrough'
			audio.addEventListener('canplay', function() {
				console.log("Ready: " + af);
				var src = context.createMediaElementSource(audio);
				src.connect(context.destination);
				audioSources.push(src);

				attemptStart();
			});

			// errors occur if audio cannot be fetched:
			audio.addEventListener('error', function() {
				console.log('error for %s', audio.src);
				console.log('error: %O', audio.error);
				stopAll();
				// Errored audio sources must be restarted.
				window.setTimeout(reloadErrored, 250);
			});

			// The user agent is trying to fetch media data, but data is unexpectedly not forthcoming:
			audio.addEventListener('stalled', function() {
				console.log('stalled for %s', audio.src);
			});
			// audio.addEventListener('loadeddata', function() {
			// 	console.log('loadeddata for %s', audio.src);
			// });
			// audio.addEventListener('progress', function() {
			// 	console.log('progress for %s', audio.src);
			// });
			audio.addEventListener('waiting', function() {
				console.log('waiting for %s', audio.src);
			});
			audio.addEventListener('emptied', function() {
				console.log('emptied for %s', audio.src);
			});
		})();
	}
})();