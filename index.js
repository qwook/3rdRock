var http = require('http');
var Promise = require("bluebird");
var Twitter = require('twitter');
var watson = require('watson-developer-cloud');
fs = require('fs');
var spawn = require('child_process').spawn;
var twitterString = ''
var client = new Twitter({
  consumer_key: '***REMOVED***',
  consumer_secret: '***REMOVED***',
  access_token_key: '***REMOVED***',
  access_token_secret: '***REMOVED***'
});

//grabbing Data from EONET
var options = {
  host: 'eonet.sci.gsfc.nasa.gov',
  path: '/api/v2.1/events'
};

var nasaData = {
  events: []
};

function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

callback = function(response) {
  var data;
  var str = "";

  response.on('data', function (chunk) {
    str += chunk.toString();
  });

  response.on('end', function () {
    // array of promises
    var promises = [];
    data = JSON.parse(str)
    data.events.forEach(function(event) {
      var eventCategory;
      var eventURL;
      function getEventCategory() {
        if (typeof event.categories[0] != "undefined") {
          eventCategory = event.categories[0].title;
        }
        else {
          eventCategory = 'none'
        }
      }
      function getEventURL() {
        if (typeof event.sources[0] != "undefined") {
              eventURL = event.sources[0].url;
            }
        else {
          eventURL = 'none'
        }
      }
      getEventURL();
      getEventCategory();
      var newEvent = {
        title: event.title,
        category: eventCategory,
        link: eventURL,
        geometries: event.geometries, 
        twitter: [],
        watson: []
      }
      nasaData.events.push(newEvent);
      // push in promises
      promises.push(getTweets(newEvent))
      promises.push(getWatsonData(newEvent))
    })

    // map promisses
    Promise.all(promises).then(function() {
      return Promise.all()

      // console.log(JSON.stringify(nasaData))
    }).then(function() {
      
    });
    // then send
  });
}

http.request(options, callback).end();
//Twitter
function getTweets(event) {
  return new Promise(function(resolve, reject) {
    client.get('search/tweets', {q: event.title}, function(error, tweets, response){
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
      resolve();
    }); 
  })
}

var getWatsonData = function(newEvent, event) {
  return new Promise(function(resolve, reject) {
    var urlString = fixedEncodeURIComponent(twitterString)
    var command = spawn('curl', ['-u', "***REMOVED***", "https://gateway.watsonplatform.net/tone-analyzer-beta/api/v3/tone?version=2016-02-11&text="+urlString ]);
    command.stdout.on('data', (data) => {
      newEvent.watson.push(data)
    });

    command.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    command.on('close', (code) => {
      resolve();
    });
  });
}

