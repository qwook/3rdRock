var http = require('http');
var Promise = require("bluebird");
var Twitter = require('twitter');
var watson = require('watson-developer-cloud');
var fs = require('fs');
var spawn = require('child_process').spawn;

var client = new Twitter({
  consumer_key: '***REMOVED***',
  consumer_secret: '***REMOVED***',
  access_token_key: '***REMOVED***',
  access_token_secret: '***REMOVED***'
});

var nasaData = {
  events: []
};

function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

// Step 1: Get data from eonet
new Promise(function(resolve, reject) {

  var options = {
    host: 'eonet.sci.gsfc.nasa.gov',
    path: '/api/v2.1/events'
  };

  http.request(options, function(response) {

    var data;
    var str = "";

    response.on('data', function (chunk) {
      str += chunk.toString();
    });

    response.on('end', function () {
      data = JSON.parse(str)
      resolve(data);
    });

  }).end();

// Step 2: Get twitter data for each event
}).then(function(data) {

  // array of promises
  var promises = [];

  data.events.forEach(function(event) {

    var eventCategory;
    var eventURL;

    if (typeof event.categories[0] != "undefined") {
      eventCategory = event.categories[0].title;
    } else {
      eventCategory = 'none'
    }

    if (typeof event.sources[0] != "undefined") {
      eventURL = event.sources[0].url;
    } else {
      eventURL = 'none'
    }

    var newEvent = {
      title: event.title,
      category: eventCategory,
      link: eventURL,
      geometries: event.geometries, 
      twitter: [],
      watson: []
    }
    nasaData.events.push(newEvent);

    // Get all the tweets for each event
    promises.push(getTweets(newEvent))
  })

  // map promisses
  Promise.all(promises).then(function() {
    fs.writeFile('data.json', JSON.stringify(nasaData))
  })

});

//Twitter
function getTweets(event) {
  // Step 1: Get tweets based on the events
  return new Promise(function(resolve, reject) {
    client.get('search/tweets', {q: event.title}, function(error, tweets, response){
      var twitterString = '';

      tweets.statuses.forEach(function(specificTweet) {
        var newTweet = {
          created: specificTweet.created_at,
          text: specificTweet.text,
          name: specificTweet.user.name,
          sceenName: specificTweet.user.screen_name,
          userPicture: specificTweet.user.profile_image_url
        }
        twitterString += newTweet.text
        event.twitter.push(newTweet);
      })

      resolve(twitterString);
    }); 
  // Step 2: Get watson data after the tweets are done
  }).then(function(twitterString) {
    return getWatsonData(event, twitterString);
  });
}

function getWatsonData (event, twitterString) {
  return new Promise(function(resolve, reject) {
    var urlString = fixedEncodeURIComponent(twitterString)
    var command = spawn('curl', ['-u', "***REMOVED***", "https://gateway.watsonplatform.net/tone-analyzer-beta/api/v3/tone?version=2016-02-11&text="+urlString ]);
    var temp = '';
    command.stdout.on('data', (data) => {
      temp += data.toString()
    });

    command.on('close', (code) => {
      event.watson.push(JSON.parse(temp));
      resolve();
    });
  });
}

