var http = require('http');
var Promise = require("bluebird");
var Twitter = require('twitter');
fs = require('fs');


//grabbing Data from EONET
var options = {
  host: 'eonet.sci.gsfc.nasa.gov',
  path: '/api/v2.1/events'
};

var nasaData = {
  events: []
};

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
        twitter: []
      }
      nasaData.events.push(newEvent);
      // push in promises
      promises.push(getTweets(newEvent))
    })

    // map promisses
    Promise.all(promises).then(function() {
      console.log(JSON.stringify(nasaData))
    });
    // then send
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
        event.twitter.push(newTweet);
      })
      resolve();
    }); 
  })
}
