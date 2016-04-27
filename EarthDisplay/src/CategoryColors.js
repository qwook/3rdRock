
//Volcano by Sergey Demushkin from the Noun Project
//Fire by Mike Ashley from the Noun Project
//drop by Dolly Vu from the Noun Project
//fast by irene hoffman from the Noun Project
//Falling Rocks by Daniele Catalanotto from the Noun Project
//Iceberg by Juan Pablo Bravo from the Noun Project

export var categories = {
    "Drought": { //
      id: 0,
      color: [255, 0, 0],
      icon: 'icons/images/icons_13.png'
    },
    "Dust and Haze": { //
      id: 1,
      color: [100, 10, 10],
      icon: 'icons/images/icons_15.png'
    },
    "Earthquakes": {
      id: 2,
      color: [10, 150, 10],
      icon: 'icons/images/earthquake.png'
    },
    "Floods": { //
      id: 3,
      color: [10, 0, 255],
      icon: 'icons/images/icons_05.png'
    },
    "Landslides": { //
      id: 4,
      color: [150, 150, 10],
      icon: 'icons/images/ice.png'
    },
    "Manmade": {
      id: 5,
      color: [0, 0, 0],
      icon: 'icons/images/manmade.png'
    },
    "Sea and Lake Ice": {
      id: 6,
      color: [225, 225, 255],
      icon: 'icons/images/ice.png'
    },
    "Severe Storms": { //
      id: 7,
      color: [70, 70, 70],
      icon: 'icons/images/icons_03.png'
    },
    "Snow": { //
      id: 8,
      color: [255, 255, 255],
      icon: 'icons/images/icons_07.png'
    },
    "Temperature Extremes": { //
      id: 9,
      color: [10, 150, 10],
      icon: 'icons/images/icons_26.png'
    },
    "Volcanoes": { //
      id: 10,
      color: [200, 0, 0],
      icon: 'icons/images/icons_18.png'
    },
    "Water Color": { //
      id: 11,
      color: [0, 50, 200],
      icon: 'icons/images/watercolor.png'
    },
    "Wildfires": { //
      id: 12,
      color: [255, 0, 0],
      icon: 'icons/images/icons_20.png'
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
