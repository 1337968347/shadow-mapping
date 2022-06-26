import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shadow-shader';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-256, 256, 256, -256, 0, 256);

camera.position.z = 0;

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
const geometry = new THREE.PlaneGeometry(1, 1);

const sunInfo = new THREE.Vector4(0, 90, 400, 20);
const uResolution = new THREE.Vector2(900, 900);

const worldMatrix = new THREE.Matrix4().makeScale(1000, 1000, 1000);

const material = new THREE.ShaderMaterial({
  uniforms: {
    mMatrix: { value: worldMatrix },
    projection: { value: camera.projectionMatrix },
    sunInfo: { value: sunInfo },
    uResolution: { value: uResolution },
  },
  vertexShader,
  fragmentShader,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const loop = (tick) => {
  tick();
  requestAnimationFrame(() => loop(tick));
};

const render = () => {
  renderer.setSize(uResolution.x, uResolution.y);
  renderer.render(scene, camera);
};

loop(render);
