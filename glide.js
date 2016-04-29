
var http = require('http');
var jsdom = require('jsdom');
var querystring = require('querystring');
var fs = require('fs');
var Promise = require("bluebird");

var jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.js', 'utf8');

var events = [];

var cookie = null;

var cats = {
  "cold wave": 'Temperature Extremes',
  "complex emergency": 'None',
  "drought": 'Drought',
  "earthquake": 'Earthquakes',
  "epidemic": 'None',
  "extratropical cyclone": 'Severe Storms',
  "extreme temperature": 'Temperature Extremes',
  "famine": 'None',
  "fire": 'Wildfires',
  "flash flood": 'Flood',
  "flood": 'Flood',
  "heat wave": 'Temperature Extremes',
  "insect infestation": 'None',
  "land slide": 'Landslides',
  "mud slide": 'Landslides',
  "other": 'None',
  "severe local storm": 'Severe Storms',
  "slide": 'Landslides',
  "snow avalanche": 'Snow',
  "storm surge": 'Severe Storms',
  "tech": 'Manmade',
  "tornadoes": 'Severe Storms',
  "tropical cyclone": 'Severe Storms',
  "tsunami": 'Flood',
  "violent wind": 'Severe Storms',
  "volcano": 'Volcanoes',
  "wave": 'Flood',
  "wild fire": 'Wildfires'
};

function normalize(str) {
  return str.toLowerCase().match(/[A-z\ ]+/g)[0].trim();
}

// incrementalPromise([
//   () => logPromise("a"),
//   () => logPromise("b"),
//   () => logPromise("c")
// ]);
var j = 0;

function parseBody(body) {

  j++;
  console.log(j);

  return new Promise(function(resolve, reject) {
    // This creates a fake "browser"
    jsdom.env({
      html: body,
      src: [jquery],
      done: function(err, window) {
        // Now you can run jquery objects in this fake browser
        var $ = window.$;

        var rowId = 0;
        for (var row of $('tr')) {
          // console.log("----- ROW " + rowId);
          var colId = 0;
          var event = {};
          for (var col of $('td.bfS', $(row))) {
            // console.log("===== COLUMN " + colId)
            // console.log($(col).text());
            var text = $(col).text().trim();
            if (text.length > 0) {

              if (colId == 0) {
                event.id = text;
              } else if (colId == 1) {
                event.category = cats[normalize(text)];
                if (!event.category || event.category.length == 0) {
                  colId = 0;
                  break;
                }
              } else if (colId == 2) {
                event.year = parseFloat(text);
              } else if (colId == 3) {
                event.latitude = parseFloat(text);
              } else if (colId == 4) {
                event.longitude = parseFloat(text);
              }

              // console.log(colId, text);
              // console.log(event);

              colId++
            } else {
              colId = 0;
              break;
            }
          }

          if (colId > 0 && !(event.lat == 0 && event.long == 0)) {
            events.push(event);
            console.log(event);
          }

          rowId++;
        }

        resolve();

        // Aris you need to push each row of the table
        // events.push()
      }
    });
  })

}

function initialSearch() {

  var postData = "variables=disasters.sEventId+%7C%7C+%27-%27+%7C%7C+sGlide+%7C%7C+%27-%27+%7C%7C++sLocationCode+as+GLIDE_number&variables=sEventName+as+Event&variables=nyear+as+Year&variables=dlatitude+as+Latitude&variables=dlongitude+as+Longitude&unlimited=Y&continueReport=Continue";

  var options = {
    hostname: 'www.glidenumber.net',
    port: 80,
    path: '/glide/public/result/report.jsp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  return new Promise(function (resolve, reject) {

    var req = http.request(options, (res, socket, head) => {
      var body = '';
      res.setEncoding('utf8');
      cookie = res.headers['set-cookie'][0];
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(body);
      })
    })
    .on('error', (e) => {
      throw(e);
    })
    .on('connect', (res, socket, head) => {
      console.log( head );
    });
    req.write(postData)
    req.end();

  }).then(function(body) {

    return parseBody(body);

  });

}

function submitForm(itemOffset) {

  // Emulate submitting a form
  var postData = querystring.stringify({
    'posted': '0',
    'nStart': itemOffset.toString()
  });

  console.log(itemOffset);
  console.log(postData);

  var options = {
    hostname: 'www.glidenumber.net',
    port: 80,
    path: '/glide/public/result/reportResults.jsp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
      'Cookie': cookie,
    }
  };

  return new Promise(function (resolve, reject) {

    var req = http.request(options, (res) => {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(body);
      })
    })
    .on('error', (e) => {
      throw(e);
    })
    req.write(postData)
    req.end();

  }).then(function(body) {

    console.log(body);
    return parseBody(body);

  });

}

var promises = [];
promises.push(() => initialSearch());
for (var i = 200; i <= 5800; i += 200) {
  // if (i > 30) { // remove these 3 lines if you want to scrape everything
  //   break;
  // }

  var fn = (function () { console.log(this); return submitForm(this) }).bind(i);
  promises.push(fn);
  promises.push(() => new Promise(function(resolve, reject) {
    fs.writeFileSync('events.json', JSON.stringify(events), 'utf8');
    resolve();
  }));
}
console.log(promises.length);

incrementalPromise(promises)
.then(function () {

  fs.writeFileSync('events.json', JSON.stringify(events), 'utf8');

});
// Promise.all(promises);


function incrementalPromise(array) {
  var p = new Promise(function(resolve, reject) {resolve()});
  for (var i = 0; i < array.length; i++) {
    var fn = array[i];
    var fn_ = (function() {return this()}).bind(fn);

    p = p.then(fn_);
  }
  return p;
}
