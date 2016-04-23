
export default class Beacon extends THREE.Object3D {

  constructor() {
    super();

    var geometry = new THREE.SphereGeometry(0.5, 5, 5);
    var material;
    if (coord[1] > 0) {
      console.log("YOO");
      material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    } else if (coord[1] == 0) {
      material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    } else {
      material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
    }
    var cube = new THREE.Mesh( geometry, material );
    cube.position.copy(pos);
    this.add( cube );
    
    // CylinderBufferGeometry
  }

}
