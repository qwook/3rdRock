
//Volcano by Sergey Demushkin from the Noun Project
//Fire by Mike Ashley from the Noun Project
//drop by Dolly Vu from the Noun Project
//fast by irene hoffman from the Noun Project
//Falling Rocks by Daniele Catalanotto from the Noun Project
//Iceberg by Juan Pablo Bravo from the Noun Project
//Earthquake by Daniele Catalanotto from the Noun Project

var categories = {
    "Drought": { //
      id: 0,
      color: [255, 0, 0],
      icon: 'icons/images/icons_17.png'
    },
    "Dust and Haze": { //
      id: 1,
      color: [100, 10, 10],
      icon: 'icons/images/icons_19.png'
    },
    "Earthquakes": {
      id: 2,
      color: [120, 150, 10],
      icon: 'icons/images/icons_29.png'
    },
    "Flood": { //
      id: 3,
      color: [10, 0, 255],
      icon: 'icons/images/icons_09.png'
    },
    "Floods": { //
      id: 3,
      color: [10, 0, 255],
      icon: 'icons/images/icons_09.png'
    },
    "Landslides": { //
      id: 4,
      color: [150, 150, 10],
      icon: 'icons/images/icons_31.png'
    },
    "Manmade": {
      id: 5,
      color: [0, 10, 20],
      icon: 'icons/images/icons_19.png'
    },
    "Sea and Lake Ice": {
      id: 6,
      color: [225, 225, 255],
      icon: 'icons/images/icons_03.png'
    },
    "Severe Storms": { //
      id: 7,
      color: [70, 70, 70],
      icon: 'icons/images/icons_07.png'
    },
    "Snow": { //
      id: 8,
      color: [255, 255, 255],
      icon: 'icons/images/icons_11.png'
    },
    "Temperature Extremes": { //
      id: 9,
      color: [10, 150, 10],
      icon: 'icons/images/icons_33.png'
    },
    "Volcanoes": { //
      id: 10,
      color: [200, 0, 0],
      icon: 'icons/images/icons_22.png'
    },
    "Water Color": { //
      id: 11,
      color: [0, 50, 200],
      icon: 'icons/images/icons_35.png'
    },
    "Wildfires": { //
      id: 12,
      color: [255, 0, 0],
      icon: 'icons/images/icons_24.png'
    },
    "None": {
      id: 13,
      color: [0, 0, 0]
    }
}

var idToCategories = [];
var colorMap = {};
for (var i in categories) {
  var cat = categories[i];
  idToCategories[cat.id] = cat;
  colorMap['' + cat.color[0] + ',' + cat.color[1] + ',' + cat.color[2]] = i;
}

function getCategoryFromColor(r,g,b) {
  return colorMap['' + r + ',' + g + ',' + b];
}

module.exports = {
  categories: categories,
  idToCategories: idToCategories,
  colorMap: colorMap,
  getCategoryFromColor: getCategoryFromColor
}
