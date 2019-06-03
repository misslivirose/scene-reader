console.log('hello world :o');

var url = "../resources/flat/scene.gltf";
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf5f5dc, 1);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 5, 0);
scene.add(directionalLight);

var loader = new THREE.GLTFLoader();
loader.load(url, (gltf) => {
  scene.add(gltf.scene);

  gltf.animations; // Array<THREE.AnimationClip>
  gltf.scene; // THREE.Scene
  gltf.scenes; // Array<THREE.Scene>
  gltf.cameras; // Array<THREE.Camera>
  gltf.asset; // Object

  console.log("Loaded");
});

camera.position.set(0, 2, 5);
controls.update();

document.body.appendChild(renderer.domElement);
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();


/** Process what is on the canvas by pressing the P key **/
const keyCodeP = 80;


document.addEventListener("keydown", event => {
  if (event.keyCode == keyCodeP) {
    var byteArrayFromCanvas = renderer.domElement.toDataURL();
    var buffer;
    fetch(byteArrayFromCanvas).then(res => res.blob()).then(blob => {
      buffer = blob;
      var req = new XMLHttpRequest();
      req.open("POST", "/requestCaption");
      req.addEventListener("load", function() {
        var status =  this.status;
        if (status == 200) {
          var response = JSON.parse(this.response);
          document.getElementById('caption').innerHTML = "A WebGL canvas that shows: " + response.message;
        }});
      req.setRequestHeader("Content-Type", "application/octet-stream");
      req.send(buffer);
    });
  }
})