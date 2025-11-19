import * as THREE from "three";
import { LoopSubdivision } from "three-subdivide";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Création classique
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lumière
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Création du cube avec subdivision
let geometry: THREE.BufferGeometry = new THREE.BoxGeometry(1, 1, 1);
const iterations = 3; // Niveau de subdivision

// Appliquer la subdivision
geometry = LoopSubdivision.modify(geometry, iterations) as THREE.BufferGeometry;

// Recalculer les normales pour des faces lisses
geometry.computeVertexNormals();

// Matériau classique
const material = new THREE.MeshStandardMaterial({
  color: 0xff6699,
  metalness: 0.3,
  roughness: 0.4,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Stocker les positions originales pour l'animation
const originalPositions = geometry.attributes.position.array.slice();
const normals = geometry.attributes.normal.array;

function animate(time: number) {
  requestAnimationFrame(animate);

  const t = time * 0.001;
  const inflateAmount = 0.2 * Math.sin(t);

  // Modifier les positions en fonction des normales
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = originalPositions[i] + normals[i] * inflateAmount;
    positions[i + 1] =
      originalPositions[i + 1] + normals[i + 1] * inflateAmount;
    positions[i + 2] =
      originalPositions[i + 2] + normals[i + 2] * inflateAmount;
  }

  geometry.attributes.position.needsUpdate = true;

  controls.update();

  renderer.render(scene, camera);
}

animate(0);
