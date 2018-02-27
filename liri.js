// load .env to use .env keys file
require("dotenv").config();

// Import  Keys
var keys = require("./keys.js");

// Import Twitter NPM pkg
var Twitter = require("twitter");

// Import node-spotify-api 
var Spotify = require("node-spotify-api");

// Import "request" NPM pkg
var request = require("request");

// Import FileSystem 
var fs = require("fs");

var action = process.argv[2];
var object = process.argv[3];

// Initialize spotify
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

// Initialize Twitter
var client = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
});
 
var nodeArgs = process.argv;

function getSpotify(songName) {

    if (songName === undefined) {
        songName = "The Sign";
    }
    spotify.search({
            type: "track",
            query: songName
        },
        function(err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;
            console.log("-----------------------------------");
            console.log("Movie results for: " + songName);
            console.log("Song name: " + songs[0].name);
            console.log("Artist name: " + songs[0].artists.name);
            console.log("Album name: " + songs[0].album.name);
            console.log("Preview link: " + songs[0].preview_url);
            console.log("-----------------------------------");
        }
    );
};

function tweet() {
	var params = {screen_name: 'michael_furey'};
	client.get('statuses/user_timeline', params, function(err, tweets, response) {
	if (err) {
    	console.log("Error occurred: " + err);
        return;
	}
	console.log("-----------------------------------");
	console.log("Tweets from @michael_furey:");
	for (var i = 0; i < tweets.length; i++) {
		console.log("Tweet #" + (tweets.length - i) + " " + tweets[i].text);
	}
	console.log("-----------------------------------");

});
}

function movie(movieName) {
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	console.log(queryUrl);
	request(queryUrl, function(error, response, body) {

	// If the request is successful
	if (!error && response.statusCode === 200) {
    	var searchResult = JSON.parse(body);
    	// console.log(searchResult);
    	console.log("-----------------------------------");
    	console.log("Movie results for: " + movieName);
    	console.log("Title: " + searchResult.title);
    	console.log("Release Year: " + searchResult.Year);
    	console.log("Rotton Tomatoes Rating: " + searchResult.Ratings[1].Value);
    	console.log("Country of origin: " + searchResult.Country);
    	console.log("Language: " + searchResult.Language);
    	console.log("********* Spoilers! **********");
    	console.log("Plot Summary: " + searchResult.Plot);
    	console.log("******************************");
    	console.log("Actors:");
    	console.log(searchResult.Actors);
    	console.log("-----------------------------------");


	}

});
}


switch(action) {
    case 'spotify':
    	var songName = "";
		for (var i = 3; i < nodeArgs.length; i++) {
			if (i > 3 && i < nodeArgs.length) {
				songName = songName + "+" + nodeArgs[i];
			}
			else {
				songName += nodeArgs[i];
			}
		}
        getSpotify(songName);
        break;
    case 'tweet':
        tweet();
        break;
    case 'movie':

		var	movieName = "";
		for (var i = 3; i < nodeArgs.length; i++) {
			if (i > 3 && i < nodeArgs.length) {
				movieName = movieName + "+" + nodeArgs[i];
			}
			else {
				movieName += nodeArgs[i];
			}
		}
		movie(movieName);
    default:
        break;
}


