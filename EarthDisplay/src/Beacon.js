
import * as Loaders from './Loaders.js';

export default class Beacon extends THREE.Object3D {

  constructor() {
    super();

    var geometry = new THREE.CylinderGeometry(0.1, 0.2, 5, 6, 6, true);
    var map = Loaders.Texture("images/beacon.png");
    var material = new THREE.MeshBasicMaterial( { map: map, color: 0xffffff, transparent: true, opacity: 0.5 } );
    var mesh = new THREE.Mesh( geometry, material );
    this.add( mesh );
    this.mesh = mesh;

    var updateListener = () => {
      this.update();
    };
    global.events.addEventListener('update', updateListener);
    this.addEventListener('removed', () => {
      global.events.removeEventListener('update', updateListener);
    })
  }

  update() {
    // this.lookAt(this.worldToLocal(new THREE.Vector3(0,0,0)));

    // console.log(m1);

    // this.updateMatrix();

  }

}
