var ngApp = angular.module('dashboard', ['ui.bootstrap', 'musicbrainz', 'youtube']);

var errorHandler = function(data, status) {
	console.log("Remote server returned status " + status + ": " + data);
}

ngApp.controller('DashboardCtrl', function($scope, musicbrainz, youtube) {

	$scope.formData = {};

	var params = {
		allowScriptAccess: "always",
		allowFullScreen: true
	};
	var atts = {
		id: "myytplayer"
	};
	swfobject.embedSWF("http://www.youtube.com/v/B-c6GphpAeY?video_id=&enablejsapi=1&playerapiid=ytplayer&version=3&autoplay=1",
		"ytapiplayer", "620px", "600px", "8", null, null, params, atts);

	$scope.findArtist = function() {
		$scope.selectedArtist = null;
		$scope.selectedRelease = null;
		musicbrainz.findArtist($scope.formData.artist, function(result) {
			$scope.searchResult = result;
		}, errorHandler);
	}

	$scope.selectArtist = function(artist) {
		$scope.selectedArtist = artist;
		if (!artist.releases) {
			artist.releases = [];
			musicbrainz.getReleases(artist["id"], function(releases) {
				console.log(releases);
				artist.releases = releases;
			}, errorHandler);
		}
	}

	$scope.deselectArtist = function(){
		$scope.selectedArtist = null;
	}

	$scope.selectRelease = function(release) {
		$scope.selectedRelease = release;
		if (!release.recordings) {
			release.recordings = [];
			musicbrainz.getRecordings(release["id"], function(recordings) {
				console.log(recordings);
				release.recordings = recordings;
			}, errorHandler);
		}
	}

	$scope.deselectRelease = function(){
		$scope.selectedRelease = null;
	}

	$scope.playRelease = function() {
		$scope.nowPlaying = {
			artist: angular.copy($scope.selectedArtist),
			release: angular.copy($scope.selectedRelease),
			index: -1
		}
		$scope.playNext();
	}

	$scope.playPrevious = function(){
		$scope.playRecording($scope.nowPlaying.index - 1);
	}

	$scope.playNext = function(){
		$scope.playRecording($scope.nowPlaying.index + 1);
	}

	$scope.playRecording = function(index){
		$scope.nowPlaying.index = index;
		var artist = $scope.nowPlaying.artist.name;
		var title = $scope.nowPlaying.release.recordings[index].title;
		$scope.findAndPlayVideo(artist, title);
	}

	$scope.findAndPlayVideo = function(artist, title){
		youtube.findVideo(artist + " " + title, function(result){
			console.log(result);
			$scope.playVideo(result["media$group"]["yt$videoid"]["$t"]);
		}, errorHandler);
	}

	$scope.playVideo = function(id){
		console.log("play video " + id);
		youtube.playVideo(id);
	}

	$scope.findAlternatives = function(){
		$scope.alternatives = null;
		var index = $scope.nowPlaying.index;
		var artist = $scope.nowPlaying.artist.name;
		var title = $scope.nowPlaying.release.recordings[index].title;
		youtube.findVideos(artist + " " + title, function(results){
			$scope.alternatives = results;
		}, errorHandler);
	}

});

