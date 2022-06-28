import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vertexShader, fragmentShader } from './sky-shader';
import { bunnyStr } from './bunny-obj';
import { getPosAndNormal } from './util';

const width = 1000;
const height = 1000;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-256, 256, 256, -256, -256, 256);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1);

// 斯坦福兔子
const { position, normal } = getPosAndNormal(bunnyStr);


// 太阳的 x y z r
const sunPos = new THREE.Vector4(0, 110, 300, 30);
const sunColor = new THREE.Vector4(1.3, 1.0, 1.0, 1.0);
const uResolution = new THREE.Vector2(width, height);

const worldMatrix = new THREE.Matrix4().makeScale(1000, 1000, 1000);
const carMatrix = new THREE.Matrix4().makeScale(1000, 1000, 1000);

const material = new THREE.ShaderMaterial({
  uniforms: {
    cameraPos: { value: camera.position },
    carMatrix: { value: carMatrix },
    mMatrix: { value: worldMatrix },
    projection: { value: camera.projectionMatrix },
    sunPos: { value: sunPos },
    sunColor: { value: sunColor },
    uResolution: { value: uResolution },
  },
  vertexShader,
  fragmentShader,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// scene.add(gltf.scene)

const loop = (tick) => {
  tick();
  requestAnimationFrame(() => loop(tick));
};

const render = () => {
  controls.update();
  renderer.setSize(uResolution.x, uResolution.y);
  renderer.render(scene, camera);
};

loop(render);
