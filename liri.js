// Declare all required node variables and global variables
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var commandSearch = process.argv;
var fs = require("fs");
var lookUp = "";

// Concat the lookUp term
for (var i = 3; i < commandSearch.length; i++) {
  if (i > 3 && i < commandSearch.length) {
    lookUp = lookUp + "+" + commandSearch[i];
  }
  else {
    lookUp += commandSearch[i];
  }
}

// Execute if statment based on Liri command
if (commandSearch[2] === "concert-this") {
  concertThis();
}

else if (commandSearch[2] === "spotify-this") {
  spotifyThis();
}
else if (commandSearch[2] === "movie-this") {

  movieThis();

}
else if (commandSearch[2] === "do-what-it-says") {
  doWhatItSays();


}
else {
  console.log('bad command');
}

// concert-this function -------------------------------------------//
function concertThis() {
  axios.get("https://rest.bandsintown.com/artists/" + lookUp + "/events?app_id=d58d8bc222c9da3b02d228061b1f407a&date=upcoming").then(
    function (response) {
      var concertTime = response.data[0].datetime;
      concertTime = moment(concertTime).format("MMMM Do YYYY, h:mm");
      console.log("\nBand : " + lookUp);

      console.log("Name of venue : " + response.data[0].venue.name);
      console.log("Location of venue : " + response.data[0].venue.city + ", " +
        response.data[0].venue.region);


      console.log("Date of event : " + concertTime + "\n");

    },

    function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message.items);
      }
      console.log(error.config);
    }
  );

}

// spotify-this function -------------------------------------------//
function spotifyThis() {
  if (lookUp === "") { lookUp = "The Sign" }

  spotify.search({ type: 'track', query: lookUp, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log("\nArtist name : " + data.tracks.items[0].artists[0].name);  // artists name
    console.log("Song Name : " + data.tracks.items[0].name);
    console.log("Link to Spotify : " + data.tracks.items[0].external_urls.spotify);
    console.log("Album Name : " + data.tracks.items[0].album.name + "\n");
  });
}

// movie-this function -------------------------------------------//
function movieThis() {
  // Then run a request with axios to the OMDB API with the movie specified
  if (lookUp === "") { lookUp = "Mr. Nobody" }

  var queryUrl = "http://www.omdbapi.com/?t=" + lookUp + "&y=&plot=short&apikey=cf6ac9db";

  axios.get(queryUrl).then(
    function (response) {
      console.log("\nMovie Title : " + response.data.Title);
      console.log("Year Movie Came Out : " + response.data.Year);
      console.log("IMBD Rating : " + response.data.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating : " + response.data.Ratings[1].Value);
      console.log("Produced In : " + response.data.Country);
      console.log("Language : " + response.data.Language);
      console.log("Plot : " + response.data.Plot);
      console.log("Actors : " + response.data.Actors + "\n");
    }
  );
}

// do-what-it-says function -------------------------------------------//
function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");
    lookUp = dataArr[1];

    if (dataArr[0] === "concert-this") {
      concertThis();
    }

    else if (dataArr[0] === "spotify-this") {
      spotifyThis();
    }
    else if (dataArr[0] === "movie-this") {
      movieThis();

    }
    else {
      console.log('bad command');
    }

  });
}