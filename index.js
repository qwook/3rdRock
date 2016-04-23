var http = require('http');
var Twitter = require('twitter');

//grabbing Data from EONET
var options = {
  host: 'eonet.sci.gsfc.nasa.gov',
  path: '/api/v2.1/events'
};

var nasaData = {};

callback = function(response) {
  var data;
  var str = "";


  response.on('data', function (chunk) {
    str += chunk.toString();
  });


  response.on('end', function () {
    data = JSON.parse(str)
    data.events.forEach(function(event) {
        getTweets(event)
    })
  });
}

http.request(options, callback).end();

//Twitter API
var client = new Twitter({
  consumer_key: '***REMOVED***',
  consumer_secret: '***REMOVED***',
  access_token_key: '***REMOVED***',
  access_token_secret: '***REMOVED***'
});
 
function getTweets(event) {
  client.get('search/tweets', {q: event.title}, function(error, tweets, response){
    tweets.statuses.forEach(function(tweet) {
      console.log(tweet)
    })
  });
}

client.stream('statuses/filter', {track: 'yungkoum'},  function(stream){
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});