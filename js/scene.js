import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2b5825';
  ctx.fillRect(0, 0, 256, 256);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 25;
    data[i]     = Math.min(255, Math.max(0, 43 + noise));
    data[i + 1] = Math.min(255, Math.max(0, 88 + noise * 1.5));
    data[i + 2] = Math.min(255, Math.max(0, 37 + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(40, 40);
  return texture;
}

export function initScene(container) {
  // Create Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color('#0a0a2e'), 80, 500);
  scene.background = new THREE.Color('#0a0a2e');

  // Create Camera
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(25, 20, 25);
  camera.lookAt(0, 3, 0);

  // Create Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.localClippingEnabled = true;
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Create Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 10;
  controls.maxDistance = 300;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.target.set(0, 3, 0);
  controls.enablePan = true;
  controls.panSpeed = 0.8;
  controls.rotateSpeed = 0.8;

  // Lighting
  const ambientLight = new THREE.AmbientLight('#b0c4de', 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5);
  directionalLight.position.set(30, 50, 30);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -150;
  directionalLight.shadow.camera.right = 150;
  directionalLight.shadow.camera.top = 150;
  directionalLight.shadow.camera.bottom = -150;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.bias = -0.0001;
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight('#87ceeb', '#3a2f1a', 0.4);
  scene.add(hemisphereLight);

  const pointLight = new THREE.PointLight('#00d4ff', 0.3);
  pointLight.position.set(0, 15, 0);
  scene.add(pointLight);

  // Natural Ground plane
  const grassTexture = createGrassTexture();
  const groundGeom = new THREE.PlaneGeometry(500, 500);
  const groundMat = new THREE.MeshStandardMaterial({
    map: grassTexture,
    roughness: 0.85,
    metalness: 0.05
  });
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Subtle site grid helper
  const gridHelper = new THREE.GridHelper(250, 125, 'rgba(40, 90, 40, 0.25)', 'rgba(30, 70, 30, 0.15)');
  scene.add(gridHelper);

  // Sky dome (simple)
  const skyGeom = new THREE.SphereGeometry(350, 32, 32);
  const skyMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#0a1628'),
    side: THREE.BackSide
  });
  const skyDome = new THREE.Mesh(skyGeom, skyMat);
  scene.add(skyDome);

  // Add stars
  for (let i = 0; i < 200; i++) {
    const starGeom = new THREE.SphereGeometry(0.2, 4, 4);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(starGeom, starMat);

    // Random position on dome
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 340;

    star.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );

    if (star.position.y > 0) {
      scene.add(star);
    }
  }

  return { scene, camera, renderer, controls };
}

export function resetCamera(camera, controls, buildingType) {
  switch (buildingType) {
    case 'contemporary-house':
      camera.position.set(20, 15, 20);
      controls.target.set(0, 3, 0);
      break;
    case 'apartment':
      camera.position.set(35, 25, 35);
      controls.target.set(0, 8, 0);
      break;
    case 'office-building':
      camera.position.set(45, 35, 45);
      controls.target.set(0, 16, 0);
      break;
    case 'glass-corporate':
      camera.position.set(40, 30, 40);
      controls.target.set(0, 13, 0);
      break;
    case 'university':
      camera.position.set(50, 30, 50);
      controls.target.set(0, 9, 0);
      break;
    case 'cathedral':
      camera.position.set(35, 22, 35);
      controls.target.set(0, 7, 0);
      break;
    case 'modern-villa':
    default:
      camera.position.set(25, 18, 25);
      controls.target.set(0, 3, 0);
      break;
  }
  controls.update();
}

export function switchToExteriorView(camera, controls, buildingType, animateFn) {
  controls.maxPolarAngle = Math.PI / 2 - 0.05;

  let targetPos = new THREE.Vector3();
  let targetLookAt = new THREE.Vector3();

  switch (buildingType) {
    case 'contemporary-house':
      targetPos.set(20, 15, 20);
      targetLookAt.set(0, 3, 0);
      break;
    case 'apartment':
      targetPos.set(35, 25, 35);
      targetLookAt.set(0, 8, 0);
      break;
    case 'office-building':
      targetPos.set(45, 35, 45);
      targetLookAt.set(0, 16, 0);
      break;
    case 'glass-corporate':
      targetPos.set(40, 30, 40);
      targetLookAt.set(0, 13, 0);
      break;
    case 'university':
      targetPos.set(50, 30, 50);
      targetLookAt.set(0, 9, 0);
      break;
    case 'cathedral':
      targetPos.set(35, 22, 35);
      targetLookAt.set(0, 7, 0);
      break;
    case 'modern-villa':
    default:
      targetPos.set(25, 18, 25);
      targetLookAt.set(0, 3, 0);
      break;
  }

  if (animateFn) {
    animateFn(camera, controls, targetPos, targetLookAt);
  } else {
    camera.position.copy(targetPos);
    controls.target.copy(targetLookAt);
    controls.update();
  }
}

export function switchToInteriorView(camera, controls, buildingType, animateFn) {
  const targetPos = new THREE.Vector3(0, 22, 16);
  const targetLookAt = new THREE.Vector3(0, 0, 0);

  controls.maxPolarAngle = Math.PI / 2.2;

  if (animateFn) {
    animateFn(camera, controls, targetPos, targetLookAt);
  } else {
    camera.position.copy(targetPos);
    controls.target.copy(targetLookAt);
    controls.update();
  }
}

export function onWindowResize(camera, renderer, container) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
