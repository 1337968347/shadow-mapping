import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vertexShader, fragmentShader } from './sky-shader';
import {
  vertexShader as bunnyVertexShader,
  fragmentShader as bunnyFragmentShader
} from './bunny-shader';
import { bunnyStr } from './bunny-obj';
import { getPosAndNormal } from './util';

// 视图宽高
const width = 700;
const height = 700;
const WORLDSIZE = 1000;
// 太阳的 x y z r
const sunPos = new THREE.Vector4(0, 0, -200, 20);
const sunColor = new THREE.Vector4(1.3, 1.0, 1.0, 1.0);
// 分辨率
const uResolution = new THREE.Vector2(width, height);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
// 相机的投影矩阵
const cameraProjectionMatrix = camera.projectionMatrix;
// 相机的 平移矩阵
const cameraTranslateMat4 = new THREE.Matrix4().makeTranslation(0, 0, -100);
const cameraProjection = new THREE.Matrix4()
  .copy(cameraProjectionMatrix)
  .multiply(cameraTranslateMat4);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const worldMatrix = new THREE.Matrix4().makeScale(
  WORLDSIZE,
  WORLDSIZE,
  WORLDSIZE
);

const renderSKy = () => {
  const skyGeometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      cameraPos: { value: camera.position },
      mMatrix: { value: worldMatrix },
      projection: { value: cameraProjection },
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

  let bunnyMatrix = new THREE.Matrix4().makeScale(100, 100, 100);
  bunnyMatrix = bunnyMatrix.multiply(
    new THREE.Matrix4().makeTranslation(0, 0, -4)
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      cameraPos: { value: camera.position },
      bunnyMatrix: { value: bunnyMatrix },
      projection: { value: cameraProjection },
      sunPos: { value: sunPos },
      sunColor: { value: sunColor },
      uResolution: { value: uResolution }
    },
    side: THREE.FrontSide,
    vertexShader: bunnyVertexShader,
    fragmentShader: bunnyFragmentShader
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

scene.add(renderBunny());
scene.add(renderSKy());

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
