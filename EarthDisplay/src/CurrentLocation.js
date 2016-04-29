
import Beacon from './Beacon.js';

import * as Loaders from './Loaders.js';

export default class CurrentLocation extends THREE.Object3D {

  constructor(data) {
    super();

    this.data = data;

    var currLocationEle = document.createElement("div");

    var currLocationTitle = document.createElement("span");
    currLocationTitle.textContent = "Current Location";
    currLocationEle.appendChild(currLocationTitle);

    currLocationEle.className = "popupDisplay tweet";
    currLocationEle.style.top = "0px";
    currLocationEle.style.left = "0px";
    this.currLocationEle = currLocationEle;

    canvasWrapper.appendChild(currLocationEle);

    this.currLocationEle.addEventListener('click', (e) => {
      this.onClick();
    });

    var beacon = new Beacon();
    this.add(beacon);
    beacon.rotation.x = -Math.PI/2;
    beacon.position.z = -2.5;
    this.beacon = beacon;
    this.beacon.mesh.material.map = Loaders.Texture("images/current_location.png");

    var updateListener = () => {
      this.update();
    };

    global.events.addEventListener('update', updateListener);

    this.addEventListener('removed', () => {
      this.destroy();
      global.events.removeEventListener('update', updateListener);
    })
  }

  onClick() {
    // leftSide.className = "";
    rightSide.className = "";
    biggieSmalls.className = "";
    // leftSide.scrollTop = 0;
    rightSide.scrollTop = 0;
    biggieSmalls.scrollTop = 0;

    var cat = earth.categoryFromLatLong(this.data.lat, this.data.long);

    events.dispatchEvent({type: 'changeFocus', data: {twitter: null, currentLocation: cat, current: true}});
  }

  startHover() {
  }

  stopHover() {
  }

  destroy() {

  }

  update() {
    this.lookAt(new THREE.Vector3(0,0,0));

    var pos3D = this.localToWorld(new THREE.Vector3(0,0,0));
    
    var pos = calc3Dto2D(pos3D);
    // console.log(pos);
    this.currLocationEle.style.left = Math.floor((pos.x+1)/2*window.innerWidth) + 'px';
    this.currLocationEle.style.top = Math.floor(window.innerHeight-Math.floor((pos.y+1)/2*window.innerHeight)) + 'px';
    // this.tweetEle.style.opacity

    if (!this.currLocationEle.overrideOpacity) {
      var dist = camera.position.length()/2;
      var opacity = (dist-camera.position.distanceTo(pos3D))/dist;
      if (opacity < 0) {
        opacity = 0;
        this.currLocationEle.style.display = 'none';
      } else {
        this.currLocationEle.style.display = 'inline-block';
      }

      if (opacity > 1) {
        opacity = 1;
      }

      this.currLocationEle.style.opacity = opacity;
    }

    if (this.currLocationEle.style.opacity <= 0) {
      this.currLocationEle.style.opacity = 0;
      this.currLocationEle.style.display = 'none';
    } else {
      if (this.hovering) {
        this.currLocationEle.style.display = 'inline-block';
      }
    }

  }
}
