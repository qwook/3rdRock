
export var categories = {
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

export var idToCategories = [];
var colorMap = {};
for (var i in categories) {
  var cat = categories[i];
  idToCategories[cat.id] = cat;
  colorMap['' + cat.color[0] + ',' + cat.color[1] + ',' + cat.color[2]] = i;
}

export function getCategoryFromColor(r,g,b) {
  return colorMap['' + r + ',' + g + ',' + b];
}
