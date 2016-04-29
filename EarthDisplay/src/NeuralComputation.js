'use strict'

var CategoryColors = require('./CategoryColors.js');

module.exports = class NeuralComputation {
  constructor(convnetjs, events, sections) {
    this.events = events;
    this.sections = sections;
    this.convnetjs = convnetjs;

    this.classes = CategoryColors.idToCategories.length;

    this.iterations = 50; // how many times to train
    this.width = 512;
    this.height = 512;

    this.neuralNets = [];
    this.trainers = [];
    this.sectionPoints = [];

    for (var i in this.sections) {
      this.neuralNets[i] = new this.convnetjs.Net();
      this.createLayer(this.neuralNets[i]);
      this.trainers[i] = this.createTrainer(this.neuralNets[i]);
      this.sectionPoints[i] = [];
    }

    // Fill up points for each section
    for (var event of events) {
      if (event.category == "None") {
        continue;
      }

      for (var i in this.sections) {
        var section = this.sections[i];
        if (
          event.longitude > section.topLeft.longitude &&
          event.longitude < section.bottomRight.longitude &&
          event.latitude < section.topLeft.latitude &&
          event.latitude > section.bottomRight.latitude
        ) {
          this.sectionPoints[i].push({category: event.category, longitude: event.longitude, latitude: event.latitude});
        }
      }

    }

  }

  createLayer(neuralNet) {  
    var layer = [];
    layer.push({type: 'input', out_sx: 1, out_sy: 1, out_depth: 2});
    layer.push({type: 'fc', num_neurons: 13, activation: 'sigmoid'});
    layer.push({type: 'fc', num_neurons: 13, activation: 'sigmoid'});
    layer.push({type: 'softmax', num_classes: this.classes});
    neuralNet.makeLayers(layer);
  }

  createTrainer(neuralNet) {
    var trainer = new this.convnetjs.SGDTrainer(neuralNet, {
      learning_rate: 0.01,
      momentum: 0.1,
      batch_size: 10,
      l2_decay: 0.001
    });
    return trainer;
  }

  latLongToXY(latitude, longitude, width, height) {
    var x = (longitude+180)/360*width;
    var y = (-latitude+90)/180*height;

    return {x: x, y: y};
  }

  train() {
    for (var s in this.sections) {
      var section = this.sections[s];

      var neuralData = [];
      var neuralDataToCompare = [];
      var neuralLabels = [];

      var width = Math.abs(section.bottomRight.longitude - section.topLeft.longitude);
      var height = Math.abs(section.bottomRight.latitude - section.topLeft.latitude);

      var topLeft = this.latLongToXY(section.topLeft.latitude, section.topLeft.longitude, 1024, 1024);
      var bottomRight = this.latLongToXY(section.bottomRight.latitude, section.bottomRight.longitude, 1024, 1024);

      var canvasWidth = Math.abs(bottomRight.x - topLeft.x);
      var canvasHeight = Math.abs(bottomRight.y - topLeft.y);

      var points = this.sectionPoints[s];

      for (var point of points) {
        for (var r = 0; r < 5; r++) {
          var pos = this.latLongToXY(
            point.latitude + (Math.random()-0.5)*0,
            point.longitude + (Math.random()-0.5)*0,
            1024,
            1024
          );

          // console.log(pos.x, pos.y, topLeft.x, topLeft.y, pos.x - topLeft.x - canvasWidth/2, pos.y - topLeft.y - canvasHeight/2);
          // return;

          neuralData.push([
            ((pos.x - topLeft.x)/canvasWidth - 0.5)*6,
            ((pos.y - topLeft.y)/canvasHeight - 0.5)*6
          ]);

          neuralDataToCompare.push(neuralData[neuralData.length-1])

          neuralLabels.push(CategoryColors.categories[point.category].id);
        }
      }

      // Fill in data for areas without points
      for (var y = 0; y <= 10; y++) {
        xLoop:
        for (var x = 0; x <= 10; x++) {
          var _x = (x/10 - 0.5)*6;
          var _y = (y/10 - 0.5)*6;

          for (var i = 0; i < neuralDataToCompare.length; i++) {
            var pos = neuralDataToCompare[i];
            var dist = Math.sqrt(Math.pow(pos[0]-_x, 2) + Math.pow(pos[1]-_y, 2))
            if (dist < 0.4) {
              continue xLoop;
            }
          }

          neuralData.push([_x, _y]);
          neuralLabels.push(13); 
        }
      }

      var neuralVolume = new this.convnetjs.Vol(1, 1, this.classes);
      for(var iters = 0; iters < this.iterations; iters++) { // run this 500 times
        for(var i = 0; i < neuralData.length; i++) {
          neuralVolume.w = neuralData[i];
          this.trainers[s].train(neuralVolume, neuralLabels[i]);
        }
      }
    }
  }

  draw(canvas) {
    var ctx = canvas.getContext('2d');

    for (var s in this.sections) {
      var section = this.sections[s];

      var topLeft = this.latLongToXY(section.topLeft.latitude, section.topLeft.longitude, canvas.width, canvas.height);
      var bottomRight = this.latLongToXY(section.bottomRight.latitude, section.bottomRight.longitude, canvas.width, canvas.height);

      var canvasWidth = Math.abs(bottomRight.x - topLeft.x);
      var canvasHeight = Math.abs(bottomRight.y - topLeft.y);

      var netResult = new this.convnetjs.Vol(1,1,this.classes);

      var segments = 1;

      for (var x = topLeft.x; x < bottomRight.x; x+=segments) {
        for (var y = topLeft.y; y < bottomRight.y; y+=segments) {
          netResult.w[0] = ((x - topLeft.x)/canvasWidth - 0.5)*6;
          netResult.w[1] = ((y - topLeft.y)/canvasHeight - 0.5)*6;
          var a = this.neuralNets[s].forward(netResult, false);

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

          if (type >= 0) {
            ctx.fillStyle = this.rgb(CategoryColors.idToCategories[type].color);
            ctx.fillRect(Math.floor(x), Math.floor(y), segments, segments);
          }
        }
      }

      // draw data points;
      for(var point of this.sectionPoints[s]) {
        var point2D = this.latLongToXY(point.latitude, point.longitude, canvas.width, canvas.height);
        ctx.fillStyle = this.rgb(CategoryColors.categories[point.category].color);
        ctx.beginPath();
        ctx.arc(point2D.x, point2D.y, 5, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  save(width, height, cb) {

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        cb(x, y, 0, 0, 0);
      }
    }

    for (var s in this.sections) {
      var section = this.sections[s];

      var topLeft = this.latLongToXY(section.topLeft.latitude, section.topLeft.longitude, width, height);
      var bottomRight = this.latLongToXY(section.bottomRight.latitude, section.bottomRight.longitude, width, height);

      var canvasWidth = Math.abs(bottomRight.x - topLeft.x);
      var canvasHeight = Math.abs(bottomRight.y - topLeft.y);

      var netResult = new this.convnetjs.Vol(1,1,this.classes);

      var segments = 1;

      for (var x = topLeft.x; x < bottomRight.x; x+=segments) {
        for (var y = topLeft.y; y < bottomRight.y; y+=segments) {
          netResult.w[0] = ((x - topLeft.x)/canvasWidth - 0.5)*6;
          netResult.w[1] = ((y - topLeft.y)/canvasHeight - 0.5)*6;

          var a = this.neuralNets[s].forward(netResult, false);

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

          if (type >= 0) {
            var color = CategoryColors.idToCategories[type].color;
            cb(Math.floor(x), Math.floor(y), color[0], color[1], color[2]);
          }
        }
      }
    }
  }

  loadJson(json) {
    console.log(json);
    for (var i in json) {
      console.log(this.sections[i]);
      this.neuralNets[i].fromJSON(json[i]);
    }
  }

  getJson() {
    var json = [];
    for (var i in this.neuralNets) {
      json[i] = this.neuralNets[i].toJSON();
    }

    return JSON.stringify({out: json});
  }

  rgb(arr) {
    return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
  }
}
