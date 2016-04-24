
import * as Loaders from './Loaders.js';
import Tweet from './Tweet.js';

var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2();

document.body.addEventListener( 'mousemove', onMouseMove, false );

var leftSide = document.getElementById("leftSide");
var rightSide = document.getElementById("rightSide");

var onCanvas = false;
function onMouseMove( event ) {

  onCanvas = event.target.id == "earth";

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;   

}


export default class EarthObject extends THREE.Object3D {
  constructor() {
    super();


    Loaders.Texture('images/elev_bump_4k.jpg').generateMipmaps = true;

    this.globeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10, 50, 50),
      new THREE.MeshPhongMaterial({
        map: Loaders.Texture('images/2_no_clouds_4k.jpg'),
        bumpMap: Loaders.Texture('images/earthbump.png'),
        bumpScale: 0.3,
        // normalMap: Loaders.Texture('images/earth_normal.png'),
        // normalScale: new THREE.Vector2(0.3,0.3),
        specularMap: Loaders.Texture('images/water_4k.png'),
        specular: new THREE.Color('grey'),
        // wireframe: true
      })
    );
    this.add(this.globeMesh);
    this.globeMesh.rotation.x = Math.PI/2;

    this.cloudMesh = new THREE.Mesh(

      new THREE.SphereGeometry(10.1, 50, 50),
      new THREE.MeshBasicMaterial({
        map: Loaders.Texture('images/Earth-clouds-1.png'),
        transparent: true
      })

    );
    this.add(this.cloudMesh);

    this.cloudMesh.rotation.x = Math.PI/2;
    this.beacons = [];

    // todo: destroy these event listeners...

    window.addEventListener( 'click', (e) => {
      if (e.target.id == "earth") {
        if (this.lastIntersect) {
          this.lastIntersect.object.parent.parent.onClick();
        }
      }
    });

    controls.addEventListener('change', function() {
      if (controls.locking) {
        return;
      }

      leftSide.className = "inside";
      rightSide.className = "inside";
    });

  }

  addEvent(event) {
    var tweet = new Tweet({message: event.title, tweets: event.twitter});
    var geo = event.geometries[0];

    var pos;
    if (geo.type == "Point") {
      pos = event.geometries[0].coordinates;
    } else {
      pos = event.geometries[0].coordinates[0][0];
    }

    tweet.position.copy(this.latLongAltToPoint(pos[1],pos[0], 10));
    this.add(tweet);

    this.beacons.push(tweet);
  }

  update() {
    // var i = 0;
    // for (var coord of this.positions) {
    //   var pos = this.latLongAltToPoint(coord[0], coord[1], coord[2]);

    //   this.cubes[i].position.copy(pos);
    //   i++;

    // }
    // console.log("yo")

    raycaster.setFromCamera( mouse, camera ); 

    if (onCanvas) {
      // calculate objects intersecting the picking ray
      var mesh = [];
      for (var i in this.beacons) {
        mesh.push(this.beacons[i].beacon.mesh);
      }

      var intersects = raycaster.intersectObjects( mesh );

      if (intersects[0] != this.lastIntersect && this.lastIntersect) {
        this.lastIntersect.object.parent.parent.stopHover();
      };

      if (intersects[0] && intersects[0] != this.lastIntersect) {
        intersects[0].object.parent.parent.startHover();
      }
      this.lastIntersect = intersects[0];
    }

    this.cloudMesh.rotation.y += deltaTime/10000;

    var opacity = camera.position.length() / 15 - 1;

    if (opacity < 0) {
      opacity = 0;
    }

    if (opacity > 1) {
      opacity = 1;
    }

    this.cloudMesh.material.opacity = opacity;
  }

  sinTest() {
    return (Math.sin((new Date()).getTime()/100)+1)/2;
  }

  latLongAltToPoint(lat, long, rho) {
    var phi = lat * Math.PI/180;// + this.sinTest()*Math.PI/2;
    // var phi = long * Math.PI/180;
    var theta = long * Math.PI/180 + Math.PI;
    var x = Math.cos(phi) * Math.cos(theta) * -rho;
    var y = Math.cos(phi) * Math.sin(theta) * -rho;
    var z = Math.sin(phi) * rho;
    return new THREE.Vector3(x, y, z);
  }
}
