import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vertexShader, fragmentShader } from './sky-shader';
import {
  vertexShader as bunnyVertexShader,
  fragmentShader as bunnyFragmentShader
} from './bunny-shader';
import { bunnyStr } from './bunny-obj';
import { getPosAndNormal } from './util';

const width = 700;
const height = 700;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100000);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// 太阳的 x y z r
const sunPos = new THREE.Vector4(0, 110, 300, 30);
const sunColor = new THREE.Vector4(1.3, 1.0, 1.0, 1.0);
const uResolution = new THREE.Vector2(width, height);

const worldMatrix = new THREE.Matrix4().makeScale(1000, 1000, 1000);

const renderSKy = () => {
  const skyGeometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      cameraPos: { value: camera.position },
      mMatrix: { value: worldMatrix },
      projection: { value: camera.projectionMatrix },
      sunPos: { value: sunPos },
      sunColor: { value: sunColor },
      uResolution: { value: uResolution }
    },
    side: THREE.BackSide,
    vertexShader,
    fragmentShader
  });

  const skyBox = new THREE.Mesh(skyGeometry, material);

  return skyBox;
};

const renderBunny = () => {
  // 斯坦福兔子
  const { position, normal } = getPosAndNormal(bunnyStr);

  const geometry = new THREE.BufferGeometry();
  const vertexs = new Float32Array(position);
  const normals = new Float32Array(normal);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertexs, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

  const bunnyMatrix = new THREE.Matrix4().makeScale(100, 100, 100);
  bunnyMatrix.makeTranslation(0, 0, -1000);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      cameraPos: { value: camera.position },
      mMatrix: { value: worldMatrix },
      projection: { value: camera.projectionMatrix },
      sunPos: { value: sunPos },
      sunColor: { value: sunColor },
      uResolution: { value: uResolution },
      bunnyMatrix: { value: bunnyMatrix }
    },
    vertexShader: bunnyVertexShader,
    fragmentShader: bunnyFragmentShader
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

scene.add(renderSKy());
scene.add(renderBunny());

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
