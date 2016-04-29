//dependencies
var http = require('http');
var https = require('https');
var Promise = require("bluebird");
var Twitter = require('twitter');
var watson = require('watson-developer-cloud');
var keyword_extractor = require("keyword-extractor");
var fs = require('fs');
var spawn = require('child_process').spawn;
var express = require('express');
var Primus = require('primus');
var GoogleSearch = require('google-search');
var keys = require('./keys.js');
var googleImages = require('google-images');

//Primus Init
var app = express();
app.use('/', express.static(__dirname + '/public'));
var server = http.createServer(app);
server.listen(3000);
var primus = new Primus(server, {});
var excludeArray = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming', 'January', 'February', 'March', 'April', 'May','June','July','August','September','October','November','December','2016'];

//API Keys Auth.
var client = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
});

var googleImageSearch = googleImages(keys.google.cx, keys.google.key);

var googleSearch = new GoogleSearch({
  key: keys.google.key,
  cx: keys.google.cx
});

var nasaData = {
  events: []
};

function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

// Step 1: Get data from EONET
// setInterval(function() {
  new Promise(function(resolve, reject) {

    var nasaOptions = {
      host: 'eonet.sci.gsfc.nasa.gov',
      path: '/api/v2.1/events'
    };

    http.request(nasaOptions, function(response) {

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
      var geometry;

      //Long/Latt need to be reversed
      if (event.geometries[0].type == "Point") {
        geometry = event.geometries[0].coordinates.reverse();
      } else {
        geometry = event.geometries[0].coordinates[0][0].reverse();
      }

      //Declaring Event Categories
      if (typeof event.categories[0] != "undefined") {
        eventCategory = event.categories[0].title;
      } else {
        eventCategory = 'none'
      }

      //Event URL
      if (typeof event.sources[0] != "undefined") {
        eventURL = event.sources[0].url;
      } else {
        eventURL = 'none'
      }

      //Event Object Template
      var newEvent = {
        title: event.title,
        category: eventCategory,
        link: eventURL,
        geometries: event.geometries, 
        twitter: [],
        watson: []
      }

      //Add Object to Master JSON
      nasaData.events.push(newEvent);

      //Grab more data each event
      promises.push(getMedia(newEvent))
    })

    //Map promisses
    Promise.all(promises).then(function() {
      fs.writeFile('streamingData.json', JSON.stringify(nasaData))
      primus.write(nasaData);
    })
  });
// }, 60000);

function getMedia(event) {
  // Step 1: Get tweets based on the events
  var title = event.title;

  //Remove Unnceccessary States/Cities from event titles
  excludeArray.forEach(function(area) {
    title = title.toLowerCase().replace(area.toLowerCase(),'')
  })
  return new Promise(function(resolve, reject) {
    client.get('search/tweets', {q: title}, function(error, tweets, response){
      var twitterString = '';
      var mediaUrl = ''
      tweets.statuses.forEach(function(specificTweet) {
        if (typeof specificTweet.entities.media == "undefined") {
          mediaUrl = null;
        } else {
          mediaUrl = specificTweet.entities.media[0].media_url
        }
        var newTweet = {
          created: specificTweet.created_at,
          text: specificTweet.text,
          name: specificTweet.user.name,
          screenName: specificTweet.user.screen_name,
          userPicture: specificTweet.user.profile_image_url,
          media: mediaUrl
        }
        //Create string of all tweets for Watson language
        twitterString += newTweet.text

        //Add twitter data to event object
        event.twitter.push(newTweet);
      })

      resolve(twitterString);
    }); 
  // Step 2: Get watson data after the tweets are done
  }).then(function(twitterString) {
    return getWatsonData(event, twitterString);
  }).then(function() {
    return getWeatherData(event);
  }).then(function() {
    return getGoogleData(event)
  }).then(function() {
    return getGoogleImages(event)
  });
}

function getWatsonData(event, twitterString) {
  return new Promise(function(resolve, reject) {
    var urlString = fixedEncodeURIComponent(twitterString);
    var command = spawn('curl', ['-u', keys.watsonText.key, "https://gateway.watsonplatform.net/tone-analyzer-beta/api/v3/tone?version=2016-02-11&text="+urlString]);
    var temp = '';
    command.stdout.on('data', (data) => {
      temp += data.toString()
    });

    command.on('close', (code) => {
      //Add watson data to event object
      event.watson.push(JSON.parse(temp));
      resolve();
    });
  });
}

function getWeatherData(event) {
  return new Promise(function(resolve, reject) {
    var geo;
    if (event.geometries[0].type == "Point") {
      geo = event.geometries[0].coordinates.reverse().join();
    } else {
      geo = event.geometries[0].coordinates[0][0].reverse().join();
    }
    geo = fixedEncodeURIComponent(geo);
    var weatherOptions = {
      host: 'twcservice.mybluemix.net',
      port: '443',
      path: '/api/weather/v2/observations/current?units=m&geocode='+geo+'&language=en-US',
      auth: keys.watsonWeather.key
    }
    https.request(weatherOptions, function(response) {
      var data;
      var str = "";

      response.on('data', function (chunk) {
        str += chunk.toString();
      });

      response.on('end', function () {
        data = JSON.parse(str);
        event.weather = data;
        resolve();
      });
    }).end();
  })
}

function getGoogleData(event) {

  return new Promise(function(resolve,reject) {
    var searchUrl = googleSearch._generateUrl({
      q: event.title,
      start: 1,
      num: 10 //# of Results
    }, function(error, response) {

    });

    var splitUrl = searchUrl.href.split('.com')
    splitUrl[0] = splitUrl[0].split('https://').pop() + '.com'

    var googleOptions = {
      host: splitUrl[0],
      path: splitUrl[1]
    };

    https.request(googleOptions, function(response) {

      var str = "";

      response.on('data', function (chunk) {
        str += chunk.toString();
      });

      response.on('end', function () {
        data = JSON.parse(str)

        //hiding api key
        try {
          if (data.queries.request[0].cx) {
            data.queries.request[0].cx = "**REMOVED**"
          }
          if (data.queries.nextpage[0].cx) { 
            data.queries.nextpage[0].cx = "**REMOVED**"
          }
        } catch (e) {}
        event.google = data
        resolve();
      });
    }).end();
  })
}

function getGoogleImages(event) {
  return new Promise(function(resolve,reject) {
    googleImageSearch.search(event.title)
      .then(function (images) {
        event.images = images;
        resolve();
    });
  })
}
