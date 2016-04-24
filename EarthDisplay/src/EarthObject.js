
import * as Loaders from './Loaders.js';
import Tweet from './Tweet.js';

export default class EarthObject extends THREE.Object3D {
  constructor() {
    super();

    this.globeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10, 50, 50),
      new THREE.MeshPhongMaterial({
        map: Loaders.Texture('images/2_no_clouds_4k.jpg'),
        bumpMap: Loaders.Texture('images/elev_bump_4k.jpg'),
        bumpScale: 0.5,
        specularMap: Loaders.Texture('images/water_4k.png'),
        specular: new THREE.Color('grey'),
        // wireframe: true
      })
    );
    this.add(this.globeMesh);
    this.globeMesh.rotation.x = Math.PI/2;

    // this.positions = [
    //   [37.3470201, -121.8935645, 10],
    //   [40.776255,-74.0137496, 10]
    // ]

    // this.cubes = [];

    // for (var coord of this.positions) {

    //   var pos = this.latLongAltToPoint(coord[0], coord[1], coord[2]);

    //   var geometry = new THREE.SphereGeometry(0.5, 5, 5);
    //   var material;
    //   if (coord[1] > 0) {
    //     console.log("YOO");
    //     material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //   } else if (coord[1] == 0) {
    //     material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    //   } else {
    //     material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
    //   }
    //   var cube = new THREE.Mesh( geometry, material );
    //   cube.position.copy(pos);
    //   this.add( cube );

    //   this.cubes.push(cube);

    // }

    // var tweet = new Tweet({message: "Hey what's up my dude!"});
    // tweet.position.copy(this.latLongAltToPoint(40.776255,-74.0137496, 10));
    // this.add(tweet);


  }

  addEvent(event) {
    var tweet = new Tweet({message: event.title});
    var geo = event.geometries[0];

    var pos;
    if (geo.type == "Point") {
      pos = event.geometries[0].coordinates;
    } else {
      pos = event.geometries[0].coordinates[0][0];
    }

    console.log(pos);

    tweet.position.copy(this.latLongAltToPoint(pos[1],pos[0], 10));
    this.add(tweet);
  }

  update() {
    // var i = 0;
    // for (var coord of this.positions) {
    //   var pos = this.latLongAltToPoint(coord[0], coord[1], coord[2]);

    //   this.cubes[i].position.copy(pos);
    //   i++;

    // }
    // console.log("yo")
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
