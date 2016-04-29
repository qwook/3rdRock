
// var gd = require('node-gd')
var PNG = require('pngjs').PNG;
var convnetjs = require('convnetjs')
var fs = require('fs');

var width = 512;
var height = 512;


// var img = gd.createTrueColorSync(width, height);

var iterations = 500;

var categories = {
    "Drought": {
      id: 0,
      color: [255, 0, 0]
    },
    "Dust and Haze": {
      id: 1,
      color: [100, 10, 10]
    },
    "Earthquakes": {
      id: 2,
      color: [10, 150, 10]
    },
    "Flood": {
      id: 3,
      color: [10, 0, 255]
    },
    "Floods": {
      id: 3,
      color: [10, 0, 255]
    },
    "Landslides": {
      id: 4,
      color: [150, 150, 10]
    },
    "Manmade": {
      id: 5,
      color: [0, 0, 0]
    },
    "Sea and Lake Ice": {
      id: 6,
      color: [225, 225, 255]
    },
    "Severe Storms": {
      id: 7,
      color: [70, 70, 70]
    },
    "Snow": {
      id: 8,
      color: [255, 255, 255]
    },
    "Temperature Extremes": {
      id: 9,
      color: [10, 150, 10]
    },
    "Volcanoes": {
      id: 10,
      color: [200, 0, 0]
    },
    "Water Color": {
      id: 11,
      color: [0, 50, 200]
    },
    "Wildfires": {
      id: 12,
      color: [255, 0, 0]
    },
    "None": {
      id: 13,
      color: [0, 0, 0]
    }
}

var idToCategories = [];
for (var i in categories) { idToCategories[categories[i].id] = categories[i]; }

function latLongToXY(latitude, longitude, width, height) {
  var x = (longitude+180)/360*width;
  var y = (-latitude+90)/180*height;

  return {x: x, y: y};
}

// Initialize Neural Network

var neuralNet = new convnetjs.Net();

var layer = [];
layer.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
layer.push({type:'fc', num_neurons:13, activation: 'sigmoid'});
layer.push({type:'fc', num_neurons:13, activation: 'sigmoid'});
layer.push({type:'softmax', num_classes:idToCategories.length});

neuralNet.makeLayers(layer);

var trainer = new convnetjs.SGDTrainer(neuralNet, {
  learning_rate: 0.01,
  momentum: 0.1,
  batch_size: 10,
  l2_decay: 0.001
});


  if (fs.existsSync('neuralNet.json')) {
    var data = JSON.parse(fs.readFileSync('neuralNet.json'));
    neuralNet.fromJSON(data);
  }

  // var data = JSON.parse(fs.readFileSync('public/dataForHenry.json', 'utf8'));
  var data = JSON.parse(fs.readFileSync('public/events.json', 'utf8'));

// process.on('SIGINT', function() {
  if (process.argv[2] == "save") {
    save();
    return;
  }

  function save() {
    console.log("Saving image...");

    var png = new PNG({
      filterType: 4,
      width: width,
      height: height
    });

    // var netx = new convnetjs.Vol(1,1,data.events.length);
    var netx = new convnetjs.Vol(1,1,idToCategories.length);
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var idx = (width * y + x) << 2;

        netx.w[0] = x/width*6-0.5;
        netx.w[1] = y/height*6-0.5;
        var a = neuralNet.forward(netx, false);

        // go through weights and see which weight is highest
        var curI = -1;
        var curWeight = -1;

        for (var j = 0; j < a.w.length; j++) {
          var weight = a.w[j];
          if (weight > curWeight) {
            curWeight = weight;
            curI = j;
          }
        }

        var type = curI;

        var color = idToCategories[type].color;

        // invert color
        png.data[idx] = color[0];
        png.data[idx+1] = color[1];
        png.data[idx+2] = color[2];

        // and reduce opacity
        png.data[idx+3] = 255;

        // img.setPixel(x, y, idToCategories[type].color);

      }
    }

    png.pack().pipe(fs.createWriteStream('out.png'));

    console.log(":-) Good Bye");
  }


for (var y = 0; y < 10000; y++) {

  var neuralData = [];
  var neuralLabels = [];
  var neuralDataToCompare = []; // clone of neuralData

  var scale = 5;

  // Load in data
  var i = 0;
  // for (var event of data.events) {
  for (var event of data) {
    var coords;

    // if (event.geometries[0].type == "Point") {

    //   coords = event.geometries[0].coordinates;
    // } else {
    //   coords = event.geometries[0].coordinates[0][0];
    // }

    var coords = [event.longitude, event.latitude];

    var realPos2D = latLongToXY(coords[1], coords[0], width, height);
    for (var r = 0; r < 3; r++) {
      var pos2D = {
        x: realPos2D.x + (Math.random()-0.5)*(width/100),
        y: realPos2D.y + (Math.random()-0.5)*(height/100)
      }
      // drawCircle(pos2D.x, pos2D.y, 5, categories[event.category].color);

      neuralData.push([pos2D.x/width*6 - 0.5, pos2D.y/height*6 - 0.5]);
      neuralDataToCompare.push(neuralData[neuralData.length-1]);
      neuralLabels.push(categories[event.category].id); 
    }
  }

  // Fill in data for areas without points
  for (var y = 0; y <= 10; y++) {
    xLoop:
    for (var x = 0; x <= 10; x++) {
      var _x = x/10*6 - 0.5;
      var _y = y/10*6 - 0.5;

      for (var i = 0; i < neuralDataToCompare.length; i++) {
        var pos = neuralDataToCompare[i];
        var dist = Math.sqrt(Math.pow(pos[0]-_x, 2) + Math.pow(pos[1]-_y, 2))
        if (dist < 0.4) {
          continue xLoop;
        }
      }

      neuralData.push([_x, _y]);
      neuralLabels.push(13); 

      // drawCircle(x/5 * width, y/5 * height, 5, [0,0,0)']
    }
  }


// return;



    // process.exit(2);

  // });

  var neuralVolume = new convnetjs.Vol(1,1,idToCategories.length);

  // incrementally train
  for(var iters = 0; iters < iterations; iters++) { // run this 500 times
    for(var i = 0; i < neuralData.length; i++) {
      neuralVolume.w = neuralData[i];
      trainer.train(neuralVolume, neuralLabels[i]);
    }
    if (iters == Math.floor(iterations/4)) {
      // console.log("25%");
    }
    if (iters == Math.floor(iterations/2)) {
      // console.log("50%");
    }
    if (iters == Math.floor(iterations*3/4)) {
      // console.log("75%");
    }

    if (iterations % 100 == 0) {
      fs.writeFileSync('neuralNet.json', JSON.stringify(neuralNet.toJSON()));
    }

    if (iterations % 5000) {
      // console.log(iterations);
    }
  }
}

save();

// var netx = new convnetjs.Vol(1,1,neuralData.length);

// draw neural network
// for(var x=0; x<=width; x+= scale) {
//   for(var y=0; y<=height; y+= scale) {
//     netx.w[0] = x/width*6-0.5;
//     netx.w[1] = y/height*6-0.5;
//     var a = neuralNet.forward(netx, false);

//     // go through weights and see which weight is highest
//     var curI = -1;
//     var curWeight = -1;

//     for (var j = 0; j < a.w.length; j++) {
//       var weight = a.w[j];
//       if (weight > curWeight) {
//         curWeight = weight;
//         curI = j;
//       }
//     }

//     var type = curI;

//     ctx.fillStyle = idToCategories[type].color;
//     ctx.fillRect(x, y, scale, scale);
//   }
// }

// for(var i = 0; i < neuralData.length; i++) {
//   drawCircle((neuralData[i][0]+0.5)/6*width, (neuralData[i][1]+0.5)/6*height, 5, idToCategories[neuralLabels[i]].color);
// }
