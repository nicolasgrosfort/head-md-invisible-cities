import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const scene = new THREE.Scene();

const loader = new FBXLoader();
const object = await loader.loadAsync("/landscape.fbx");
object.position.set(0, 0, 0);
object.scale.set(0.01, 0.01, 0.01);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 200;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);

scene.add(ambientLight);
scene.add(light);
scene.add(object);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  camera.position.x += 0.1;
}

animate();
