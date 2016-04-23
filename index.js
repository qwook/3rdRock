var http = require('http');
var Twitter = require('twitter');
fs = require('fs');


//grabbing Data from EONET
var options = {
  host: 'eonet.sci.gsfc.nasa.gov',
  path: '/api/v2.1/events'
};

// var nasaData = {
//   events: [
//     {
//       title: 'HUGE FIRE',
//       coordinates: [
//           longitude: 13431412,
//           latitude: 234233,
//       ],
//       link: www.website.com,
//       tweets: [
//         {
//             username:
//             profilePicture:
//             date:
//             tweet:
//         }
//       ]
//     }
//   ]
// };

callback = function(response) {
  var data;
  var str = "";


  response.on('data', function (chunk) {
    str += chunk.toString();
  });


  response.on('end', function () {
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
        geometries: event.geometries 
      }
      console.log(newEvent)
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
      tweets.statuses.forEach(function(specificTweet) {
        nasaData
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