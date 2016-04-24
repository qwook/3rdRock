define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CacheTexture = CacheTexture;
  exports.Texture = Texture;
  exports.CacheJSON = CacheJSON;
  exports.getJSON = getJSON;

  var textures = {};

  var textureLoader = new THREE.TextureLoader();

  function CacheTexture(url) {

    return new Promise(function (resolve, reject) {
      textureLoader.load(url, function (texture) {
        textures[url] = texture;
        resolve(texture);
      }, function (xhr) {
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      }, function (xhr) {
        reject("Error downloading " + url);
      });
    });
  }

  function Texture(url) {
    if (!textures[url]) {
      throw "Couldn't find texture " + url;
    }
    return textures[url];
  }

  var jsons = {};

  var jsonLoader = new THREE.JSONLoader();
  // var _JSON = JSON;
  // console.log(_JSON);

  function CacheJSON(url) {
    return new Promise(function (resolve, reject) {
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
      };
    });
  };

  function getJSON(url) {
    return jsons[url];
  }
});
//# sourceMappingURL=Loaders.js.map
