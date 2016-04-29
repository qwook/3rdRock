
var textures = {};

var textureLoader = new THREE.TextureLoader();

export function CacheTexture (url) {

  return new Promise ((resolve, reject) => {
    textureLoader.load(
      url,
      function ( texture ) {
        textures[url] = texture;
        resolve(texture);
      },
      function ( xhr ) {
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function ( xhr ) {
        reject("Error downloading " + url);
      }
    );
  });
}

export function Texture (url) {
  if (!textures[url]) {
    throw "Couldn't find texture " + url;
  }
  return textures[url];
}

var jsons = {};

var jsonLoader = new THREE.JSONLoader();
// var _JSON = JSON;
// console.log(_JSON);

export function CacheJSON(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);

          jsons[url] = json;
          resolve(json);
        } else {
          reject('Error: ' + xhr.status);
        }
      }
    }
  });
};

export function getJSON (url) {
  return jsons[url];
}
