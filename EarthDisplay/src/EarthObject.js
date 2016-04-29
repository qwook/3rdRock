
import * as Loaders from './Loaders.js';
import Tweet from './Tweet.js';
import CurrentLocation from './CurrentLocation.js';
import * as CategoryColors from './CategoryColors.js';

var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2();

document.body.addEventListener( 'mousemove', onMouseMove, false );
document.body.addEventListener( 'click', onClick, false );

var leftSide = document.getElementById("leftSide");
var rightSide = document.getElementById("rightSide");
var biggieSmalls = document.getElementById("biggieSmalls");
var closeButton = document.getElementById("close");
var misterWorldWide = document.getElementById("misterWorldWide");

var onCanvas = false;
function onMouseMove( event ) {

  onCanvas = event.target.id == "earth";

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;   

  misterWorldWide.style.right = window.innerWidth-event.clientX + "px";
  misterWorldWide.style.bottom = window.innerHeight-event.clientY+30 + "px";

}

var lastClick = 0;
function onClick( event ) {
  if (event.target.id == "earth") {
    var currentClick = (new Date()).getTime();

    if (currentClick - lastClick < 250) {
      earth.doubleClick(event);
    }

    lastClick = currentClick;
  }
}

var lastMouseDown = 0;
document.getElementById("earth").addEventListener( 'mousedown', function() {
  lastMouseDown = (new Date()).getTime();
});

document.body.addEventListener( 'mouseup', function(event) {
  var currentClick = (new Date()).getTime();

  if (currentClick - lastMouseDown < 200) {
    earth.tap(event);
  }
}, false );

export default class EarthObject extends THREE.Object3D {
  constructor() {
    super();


    // Loaders.Texture('images/elev_bump_4k.jpg').generateMipmaps = true;

    Promise.all([
      Loaders.CacheTexture('/map/0/0'),
      Loaders.CacheTexture('/map/1/0'),
      Loaders.CacheTexture('/map/1/1'),
      Loaders.CacheTexture('/map/0/1'),
    ]).then((texture) => {

      global.TwoDplane.material.map = Loaders.Texture('/map/0/0');
      global.TwoDplane.scale.x = 0.5;
      global.TwoDplane.scale.y = 0.5;
      global.TwoDplane.position.x = -0.5;
      global.TwoDplane.position.y = 0.5;

      global.TwoDplane1.material.map = Loaders.Texture('/map/1/0');
      global.TwoDplane1.scale.x = 0.5;
      global.TwoDplane1.scale.y = 0.5;
      global.TwoDplane1.position.x = -0.5;
      global.TwoDplane1.position.y = -0.5;

      global.TwoDplane2.material.map = Loaders.Texture('/map/0/1');
      global.TwoDplane2.scale.x = 0.5;
      global.TwoDplane2.scale.y = 0.5;
      global.TwoDplane2.position.x = 0.5;
      global.TwoDplane2.position.y = 0.5;

      global.TwoDplane3.material.map = Loaders.Texture('/map/1/1');
      global.TwoDplane3.scale.x = 0.5;
      global.TwoDplane3.scale.y = 0.5;
      global.TwoDplane3.position.x = 0.5;
      global.TwoDplane3.position.y = -0.5;


      // renderer.render(TwoDscene, TwoDcamera);
      renderer.render(TwoDscene, TwoDcamera, this.renderTarget);
      // renderer.render(TwoDscene, TwoDcamera);
    })

    this.renderTarget = new THREE.WebGLRenderTarget(1024*4, 1024*4);
    // global.TwoDplane.material.map = Loaders.Texture('images/2_no_clouds_4k.jpg');
    // renderer.render(TwoDscene, TwoDcamera, this.renderTarget);

    this.globeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10, 50, 50),
      new THREE.MeshPhongMaterial({
        // map: this.renderTarget,
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


    this.globeMeshSatellite = new THREE.Mesh(
      new THREE.SphereGeometry(10, 50, 50),
      new THREE.MeshBasicMaterial({
        map: this.renderTarget
      })
    );
    this.add(this.globeMeshSatellite);
    this.globeMeshSatellite.rotation.x = Math.PI/2;


    this.outlineMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10.1, 50, 50),
      new THREE.MeshBasicMaterial({
        // map: Loaders.Texture('images/yes.png'),
        alphaMap: Loaders.Texture('images/edge_alpha.png'),
        transparent: true
      })
    );
    this.add(this.outlineMesh);
    this.outlineMesh.rotation.x = Math.PI/2;



    this.neuralMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10.1, 50, 50),
      new THREE.MeshBasicMaterial({
        map: Loaders.Texture('images/neural.png'),
        opacity: 0.5,
        transparent: true
      })
    );
    this.add(this.neuralMesh);
    this.neuralMesh.rotation.x = Math.PI/2;

    this.neuralImg = new Image();
    this.neuralImg.src = 'images/neural.png';
    this.neuralImg.onload = () => {
      var canvas = document.createElement('canvas');
      canvas.width = this.neuralImg.width;
      canvas.height = this.neuralImg.height;
      canvas.getContext('2d').drawImage(this.neuralImg, 0, 0, this.neuralImg.width, this.neuralImg.height);
      this.neuralCanvas = canvas;
    };

    this.hovering = false;


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
    this.current = "standard";
    this.currentCat = "None";

    // todo: destroy these event listeners...

    // window.addEventListener( 'click', (e) => {
    //   if (e.target.id == "earth") {
    //     if (this.lastIntersect) {
    //       this.lastIntersect.object.parent.parent.onClick();
    //     }

    //     e.preventDefault();
    //   }
    // });

    controls.addEventListener('change', () => {
      if (controls.locking) {
        return;
      }

      leftSide.className = "inside";
      rightSide.className = "inside";
      biggieSmalls.className = "inside";

      var tweet = this.showingInfo;
      this.showingInfo = false;
      if (tweet) {

        var children = tweet.tweetEle.parentNode.childNodes;
        for (var i in children) {
          var child = children[i];
          if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
            child.overrideOpacity = false;
          }
        }
        tweet.beacon.mesh.material.opacity = 0.5;

      }
    });

    closeButton.addEventListener('click', () => {
      leftSide.className = "inside";
      rightSide.className = "inside";
      biggieSmalls.className = "inside";

      var tweet = this.showingInfo;
      this.showingInfo = false;
      if (tweet) {
        tweet.stopHover();
      }
    });

    navigator.geolocation.getCurrentPosition((geo) => {
      var currentLocation = new CurrentLocation({lat: geo.coords.latitude, long: geo.coords.longitude});

      currentLocation.position.copy(this.latLongAltToPoint(geo.coords.latitude, geo.coords.longitude, 10));
      this.add(currentLocation);
      console.log(geo.coords);

      this.currentLocation = currentLocation;
    });

  }

  addEvent(event) {
    var tweet = new Tweet(event);
    var geo = event.geometries[0];

    var pos;
    if (geo.type == "Point") {
      pos = event.geometries[0].coordinates;
    } else {
      pos = event.geometries[0].coordinates[0][0];
    }
    event.coords = {lat: pos[1], long: pos[0]};

    tweet.position.copy(this.latLongAltToPoint(pos[1],pos[0], 10));
    this.add(tweet);

    this.beacons.push(tweet);
  }

  tap(event) {

    if (event.target.id == "earth") {
      if (this.lastIntersect) {
        this.lastIntersect.object.parent.parent.onClick();
        controls.forceOut();
      }
    }

    if (this.globeIntersect) {
      console.log(this.current);
      if (this.current == "neural") {
        // leftSide.className = "";
        rightSide.className = "";
        biggieSmalls.className = "";
        // leftSide.scrollTop = 0;
        rightSide.scrollTop = 0;
        biggieSmalls.scrollTop = 0;
        events.dispatchEvent({type: 'changeFocus', data: {twitter: null, currentLocation: this.currentCat, current: false}});
      }
    }
  }

  doubleClick(event) {

    if (this.globeIntersect) {
        // camera.position.copy( lol );

        var pt = this.globeIntersect.point.clone()

        // console.log(pt);
        // console.log(pt.length());
        // console.log(camera.position.length());

        pt.divideScalar(pt.length());
        pt.multiplyScalar(camera.position.length());

        // console.log(pt);

        this.goal = pt;
        this.isGoing = true;

        controls.enabled = false;
        // controls.locking = true;
        event.preventDefault();
    }
  }

  categoryFromLatLong(lat, long) {
    var pos2D = this.latLongToXY(lat, long, 1026, 1026);
    var pixelData = this.neuralCanvas.getContext('2d').getImageData(Math.floor(pos2D.x), Math.floor(pos2D.y), 1, 1).data;

    return CategoryColors.getCategoryFromColor(pixelData[0], pixelData[1], pixelData[2]);
  }

  update() {
    // var i = 0;
    // for (var coord of this.positions) {
    //   var pos = this.latLongAltToPoint(coord[0], coord[1], coord[2]);

    //   this.cubes[i].position.copy(pos);
    //   i++;

    // }
    // console.log("yo")


    if (this.isGoing) {
      camera.position.lerp(this.goal, 0.1);
      if ( camera.position.distanceTo(this.goal) < 0.1 ) {
        this.isGoing = false;
        controls.enabled = true;
      }
    }

    if (this.current == "standard") {
      this.globeMesh.visible = true;
      this.globeMeshSatellite.visible = false;
      this.outlineMesh.visible = false;
      this.cloudMesh.visible = true;
      this.neuralMesh.visible = false;
    } else if (this.current == "neural") {
      this.globeMesh.visible = true;
      this.globeMeshSatellite.visible = false;
      this.outlineMesh.visible = false;
      this.cloudMesh.visible = false;
      this.neuralMesh.visible = true;
    } else {
      this.globeMesh.visible = false;
      this.globeMeshSatellite.visible = true;
      this.outlineMesh.visible = true;
      this.cloudMesh.visible = false;
      this.neuralMesh.visible = false;
    }

    if (this.current == "neural") {
      for (var beacon of this.beacons) {
        beacon.visible = false;
      }
    } else {
      for (var beacon of this.beacons) {
        beacon.visible = true;
      }
    }

    raycaster.setFromCamera( mouse, camera ); 

    if (this.hovering) {
      misterWorldWide.style.display = 'none';
    }

    if (onCanvas) {
      // calculate objects intersecting the picking ray
      var mesh = [];

      if (this.current != "neural") {
        for (var i in this.beacons) {
          mesh.push(this.beacons[i].beacon.mesh);
        }
      }

      mesh.push(this.globeMesh);

      if (this.currentLocation) {
        mesh.push(this.currentLocation.beacon.mesh);
      }

      var olVis = this.globeMesh.visible;
      this.globeMesh.visible = true;
      var intersects = raycaster.intersectObjects( mesh );
      this.globeMesh.visible = olVis;

      this.globeIntersect = null;

      if (intersects[0] && intersects[0].object != this.globeMesh) {

        if (this.lastIntersect && intersects[0].object != this.lastIntersect.object) {
          this.lastIntersect.object.parent.parent.stopHover();
        };

        if (intersects[0] && (!this.lastIntersect || intersects[0].object != this.lastIntersect.object)) {
          intersects[0].object.parent.parent.startHover();
        }
        this.lastIntersect = intersects[0];

        misterWorldWide.style.display = 'none';

      } else {
        if (this.lastIntersect) {
          this.lastIntersect.object.parent.parent.stopHover();
        }
        this.lastIntersect = null;

        if (intersects[0] && intersects[0].object == this.globeMesh) {
          this.globeIntersect = intersects[0];
        }

        // Mouse if over the globe during neural mode
        if (!this.showingInfo && this.current == "neural" && intersects[0] && intersects[0].object == this.globeMesh) {

          var point = this.worldToLocal(intersects[0].point.clone());
          var rho = point.length();
          var coords = this.pointToLongLat(point.x, point.y, point.z, rho);
          if (coords.lat < -90) {
            coords.lat += 360;
          }

          // Display data about where the user is hovering
          var pos2D = this.latLongToXY(coords.lat, coords.long, 1026, 1026);
          var pixelData = this.neuralCanvas.getContext('2d').getImageData(pos2D.x, pos2D.y, 1, 1).data;

          var category = CategoryColors.getCategoryFromColor(pixelData[0], pixelData[1], pixelData[2]);
          misterWorldWide.textContent = category;
          misterWorldWide.style.display = 'inline-block';
          this.currentCat = category;

        } else {
          misterWorldWide.style.display = 'none';
        }
      }
    }

    // Cloud rotation and opacity
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

  latLongToXY(latitude, longitude, width, height) {
    var x = (longitude+180)/360*width;
    var y = (-latitude+90)/180*height;

    return {x: x, y: y};
  }

  pointToLongLat(x, y, z, rho) {
    var phi = Math.asin(z / rho);
    var theta = Math.atan2(y, x);

    var lat = phi / (Math.PI/180);
    var long = (theta - Math.PI) / (Math.PI/180) + 180;

    return {lat: lat, long: long};
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
