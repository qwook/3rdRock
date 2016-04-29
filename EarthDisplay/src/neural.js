
import './src/ImageLoader_Overwrite.js'

import * as Loaders from './src/Loaders.js';


Promise.all([
  Loaders.CacheJSON('events.json')
]).then(function() {

  var categories = {
    "Drought": {
      id: 0,
      color: 'rgb(255, 0, 0)'
    },
    "Dust and Haze": {
      id: 1,
      color: 'rgb(100, 10, 10)'
    },
    "Earthquakes": {
      id: 2,
      color: 'rgb(10, 150, 10)'
    },
    "Flood": {
      id: 3,
      color: 'rgb(10, 0, 255)'
    },
    "Floods": {
      id: 3,
      color: 'rgb(10, 0, 255)'
    },
    "Landslides": {
      id: 4,
      color: 'rgb(150, 150, 10)'
    },
    "Manmade": {
      id: 5,
      color: 'rgb(0, 0, 0)'
    },
    "Sea and Lake Ice": {
      id: 6,
      color: 'rgb(225, 225, 255)'
    },
    "Severe Storms": {
      id: 7,
      color: 'rgb(70, 70, 70)'
    },
    "Snow": {
      id: 8,
      color: 'rgb(255, 255, 255)'
    },
    "Temperature Extremes": {
      id: 9,
      color: 'rgb(10, 150, 10)'
    },
    "Volcanoes": {
      id: 10,
      color: 'rgb(200, 0, 0)'
    },
    "Water Color": {
      id: 11,
      color: 'rgb(0, 50, 200)'
    },
    "Wildfires": {
      id: 12,
      color: 'rgb(255, 0, 0)'
    },
    "None": {
      id: 13,
      color: 'rgb(0, 0, 0)'
    }
  }

  var idToCategories = [];
  for (var i in categories) { idToCategories[categories[i].id] = categories[i]; }

  var canvas = document.getElementById("neural");
  var ctx = canvas.getContext('2d');

  var width = canvas.width;
  var height = canvas.height;

  function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawCircle(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function latLongToXY(latitude, longitude, width, height) {
    var x = (longitude+180)/360*width;
    var y = (-latitude+90)/180*height;

    return {x: x, y: y};
  }

  // Initialize Neural Network

  var neuralNet = new convnetjs.Net();

  var layer = [];
  layer.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
  layer.push({type:'fc', num_neurons:6, activation: 'sigmoid'});
  layer.push({type:'fc', num_neurons:2, activation: 'sigmoid'});
  // layer.push({type:'fc', num_neurons:2, activation: 'sigmoid'});
  layer.push({type:'softmax', num_classes:idToCategories.length});

  neuralNet.makeLayers(layer);

  var trainer = new convnetjs.SGDTrainer(neuralNet, {
    learning_rate: 0.01,
    momentum: 0.1,
    batch_size: 10,
    l2_decay: 0.001
  });

  var neuralData = [];
  var neuralLabels = [];
  var neuralDataToCompare = []; // clone of neuralData

  var scale = 5;

  // Load in data
  var i = 0;
  var data = Loaders.getJSON('events.json');
  console.log(data.length);
  for (var event of data) {
    // var coords;

    // if (event.geometries[0].type == "Point") {

    //   coords = event.geometries[0].coordinates;
    // } else {
    //   coords = event.geometries[0].coordinates[0][0];
    // }

    var coords = [event.longitude, event.latitude];

    var realPos2D = latLongToXY(coords[1], coords[0], width, height);
    // for (var r = 0; r < 5; r++) {
    //   var pos2D = {
    //     x: realPos2D.x + (Math.random()-0.5)*(width/10),
    //     y: realPos2D.y + (Math.random()-0.5)*(height/10)
    //   }
    //   drawCircle(pos2D.x, pos2D.y, 5, categories[event.category].color);

    //   neuralData.push([pos2D.x/width*6 - 0.5, pos2D.y/height*6 - 0.5]);
    //   neuralDataToCompare.push(neuralData[neuralData.length-1]);
    //   neuralLabels.push(categories[event.category].id); 
    // }

      drawCircle(realPos2D.x, realPos2D.y, 5, categories[event.category].color);

    neuralData.push([realPos2D.x/width*6 - 0.5, realPos2D.y/height*6 - 0.5]);
    neuralDataToCompare.push(neuralData[neuralData.length-1]);
    neuralLabels.push(categories[event.category].id); 
    i++;
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

      drawCircle(x/10 * width, y/10 * height, 5, 'rgb(0,0,0)')
    }
  }

  // // Fill in data for areas without points
  // for (var y = 0; y < 20; y++) {
  //   xLoop:
  //   for (var x = 0; x < 20; x++) {
  //     var _x = x/20*6 - 0.5;
  //     var _y = y/20*6 - 0.5;

  //     for (var i = 0; i < neuralDataToCompare.length; i++) {
  //       var pos = neuralDataToCompare[i];
  //       var dist = Math.sqrt(Math.pow(pos[0]-_x, 2) + Math.pow(pos[1]-_y, 2))
  //       if (dist < 1) {
  //         continue xLoop;
  //       }
  //     }

  //     neuralData.push([_x, _y]);
  //     neuralLabels.push(13); 

  //     drawCircle(x/20 * width, y/20 * height, 5, 'rgb(0,0,0)');
  //   }
  // }


  // return;

  function yo() {
    return Loaders.CacheJSON("./neuralNet.json")
    .then(function(data) {

      neuralNet.fromJSON(data);

      var netx = new convnetjs.Vol(1,1,neuralData.length);

      // draw neural network
      for(var x=0; x<=width; x+= scale) {
        for(var y=0; y<=height; y+= scale) {
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

          ctx.fillStyle = idToCategories[type].color;
          ctx.fillRect(x, y, scale, scale);
        }
      }

      for(var i = 0; i < neuralData.length; i++) {
        drawCircle((neuralData[i][0]+0.5)/6*width, (neuralData[i][1]+0.5)/6*height, 5, idToCategories[neuralLabels[i]].color);
      }

      setTimeout(() => yo(), 100);

    });
  }

  yo();

});
