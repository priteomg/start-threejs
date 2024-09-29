import * as THREE from "three";
import { DoubleSide } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as dat from "dat.gui";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(windowWidth, windowHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  windowWidth / windowHeight,
  0.1,
  1000
);

// เส้นแกน
const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

// orbit สามารถใช้เมาส์หมุนรอบๆ object
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

camera.position.set(-10, 30, 30);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// กำเเพงขาวๆ
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: "#FFFFFF",
  side: DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

// Grid
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// SPHERE OBJECT
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#e91f64",
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

// Ambient light (no shadow)
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// // Directional Light (sun light)
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightCameraHelper);

const spotLight = new THREE.SpotLight(0xffffff, 100000);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// DAT.GUI Controller
const datGUI = new dat.GUI();

const option = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0.1,
  intensity: 100000,
};

datGUI.addColor(option, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});

datGUI.add(option, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});

datGUI.add(option, "speed", 0, 0.1);
datGUI.add(option, "angle", 0, Math.PI / 2);
datGUI.add(option, "penumbra", 0, 0.1);
datGUI.add(option, "intensity", 0, 200000);

let step = 0;

function animate(time) {
  cube.rotation.x = time / 1000;
  cube.rotation.y = time / 1000;

  step += option.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = option.angle;
  spotLight.penumbra = option.penumbra;
  spotLight.intensity = option.intensity;
  spotLightHelper.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
