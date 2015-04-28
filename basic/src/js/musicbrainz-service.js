angular.module('musicbrainz', []).factory('musicbrainz', function($http) {
	return new function() {

		var musicbrainz = this;

		this.findArtist = function(artist, onSuccess, onError) {
			sendRequest("artist?query=" + artist, onSuccess, onError);
		};

		this.getReleases = function(artist, onSuccess, onError) {
			sendRequest("artist/" + artist + "?inc=releases", function(artist){
				onSuccess(artist.releases);
			}, onError);
		}

		this.getRecordings = function(release, onSuccess, onError) {
			sendRequest("release/" + release + "?inc=recordings", function(release){
				onSuccess(release.media[0].tracks);
			}, onError);
		}

		function sendRequest(url, onSuccess, onError) {
			if (url.indexOf("?") == -1) {
				url = url + "?fmt=json";
			} else {
				url = url + "&fmt=json";
			}
			$http({
				method: 'GET',
				url: 'http://musicbrainz.org/ws/2/' + url,
			}).success(function(data) {
				console.log(JSON.stringify(data));
				onSuccess(data);
			}).error(onError);
		}

	};
});