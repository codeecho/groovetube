var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytplayer;

function onYouTubeIframeAPIReady() {
	ytplayer = new YT.Player('ytplayer', {
		height: '390',
		width: '640',
		videoId: '',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		$("body").scope().playNext();
	}
}

angular.module('youtube', []).factory('youtube', function($http) {
	return new function() {

		var youtube = this;

		this.findVideo = function(query, onSuccess, onError) {
			$http({
				method: 'GET',
				url: 'https://gdata.youtube.com/feeds/api/videos?q=' + query + '&max-results=1&v=2&alt=json&orderBy=relevance',
			}).success(function(data) {
				onSuccess(data.feed.entry[0]);
			}).error(onError);
		};

		this.findVideos = function(query, onSuccess, onError) {
			$http({
				method: 'GET',
				url: 'https://gdata.youtube.com/feeds/api/videos?q=' + query + '&max-results=10&v=2&alt=json&orderBy=relevance',
			}).success(function(data) {
				console.log(JSON.stringify(data));
				onSuccess(data.feed.entry);
			}).error(onError);
		};

		this.playVideo = function(id){
			ytplayer.loadVideoById(id, 0, "large");
		}

		this.stopVideo = function(){
			ytplayer.stopVideo();
		}

	};
});