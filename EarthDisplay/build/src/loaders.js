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

  var progress = 0;
  var full = 0;

  function markDone() {
    progress += 1;

    var progressEle = document.getElementById("loading").getElementsByClassName("progress")[0].getElementsByClassName("progress-bar")[0];
    progressEle.style.width = progress / full * 100 + "%";

    // var progress = $('#loading .progress').first()[0]
    // progress.style.width = (progress / full) + "%";

    // console.log(progress);
    // console.log(progress.style.width);

    console.log("markDone");

    if (progress == full) {
      $('#loading').addClass('done');
    }
  }

  function CacheTexture(url) {

    full += 1;

    return new Promise(function (resolve, reject) {
      textureLoader.load(url, function (texture) {
        markDone();
        textures[url] = texture;
        resolve(texture);
      }, function (xhr) {
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      }, function (xhr) {
        markDone();
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

    full += 1;

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.send(null);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            jsons[url] = json;
            markDone();
            resolve(json);
          } else {
            markDone();
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
