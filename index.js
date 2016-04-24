var http = require('http');
var https = require('https');
var Promise = require("bluebird");
var Twitter = require('twitter');
var watson = require('watson-developer-cloud');
var fs = require('fs');
var spawn = require('child_process').spawn;
var excludeArray = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming', 'January', 'February', 'March', 'April', 'May','June','July','August','September','October','November','December','2016'];

var client = new Twitter({
  consumer_key: '***REMOVED***',
  consumer_secret: '***REMOVED***',
  access_token_key: '***REMOVED***',
  access_token_secret: '***REMOVED***'
});

var nasaData = {
  events: [],
  hanaPoints: []
};

function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}


// Step 1: Get data from eonet
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

    //Calculating geometric points for hanaPoints
    if (event.geometries[0].type == "Point") {
      geometry = event.geometries[0].coordinates.reverse();
    } else {
      geometry = event.geometries[0].coordinates[0][0].reverse();
    }

    //Assigning Categories
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
      watson: [],
      alchemy: []
    }
    for (var i=0; i<30; i++) {
      var randomGeometry = []
      geometry.forEach(function(coordinate) {
        randomGeometry.push(coordinate +10*(Math.random()-0.5))
      });
      var newHanaPoint = {
        category: eventCategory,
        geometries: randomGeometry
      };
      nasaData.hanaPoints.push(newHanaPoint);
    }
    nasaData.events.push(newEvent);
    promises.push(getMedia(newEvent))
  })

  // map promisses
  Promise.all(promises).then(function() {
    fs.writeFile('data.json', JSON.stringify(nasaData))
  })

});

//Media
function getMedia(event) {
  // Step 1: Get tweets based on the events
  var title = event.title;
  excludeArray.forEach(function(area) {
    title = title.toLowerCase().replace(area.toLowerCase(),'')
  })
  return new Promise(function(resolve, reject) {
    client.get('search/tweets', {q: title}, function(error, tweets, response){
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
  }).then(function() {
    return getAlchemyData(event);
  }).then(function() {
    return getWeatherData(event);
  });
}

function getWatsonData(event, twitterString) {
  return new Promise(function(resolve, reject) {
    var urlString = fixedEncodeURIComponent(twitterString);
    var command = spawn('curl', ['-u', "***REMOVED***", "https://gateway.watsonplatform.net/tone-analyzer-beta/api/v3/tone?version=2016-02-11&text="+urlString]);
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

function getAlchemyData(event) {
  return new Promise(function(resolve, reject) {
    var string = fixedEncodeURIComponent(event.title);
    var alchemyOptions = {
      host: 'access.alchemyapi.com',
      path: "/calls/data/GetNews?apikey=***REMOVED***&return=enriched.url.url,enriched.url.title&start=1460851200&end=1461538800&q.enriched.url.text="+string+"&count=5&outputMode=json"
      //CHANGE COUNT=1 TO COUNT =5 LATER
    };
    http.request(alchemyOptions, function(response) {

      var data;
      var str = "";

      response.on('data', function (chunk) {
        str += chunk.toString();
      });

      response.on('end', function () {
        data = JSON.parse(str)
        event.alchemy.push(data)
        resolve();
      });
    }).end();
  })
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
      auth: '***REMOVED***'
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
