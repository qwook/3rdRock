
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
