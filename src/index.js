import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { vertexShader, fragmentShader } from './shadow-shader';

const loader = new GLTFLoader();

loader.load(
  './free_1972_datsun_240k_gt/scene.gltf',
  function (gltf) {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-256, 256, 256, -256, 0, 256);

    camera.position.z = 10;
    console.log(camera.position)

    const renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);
    const geometry = new THREE.PlaneGeometry(1, 1);

    const sunInfo = new THREE.Vector4(0, 150, 400, 20);
    const uResolution = new THREE.Vector2(900, 900);

    const worldMatrix = new THREE.Matrix4().makeScale(1000, 1000, 1000);
    const carMatrix = new THREE.Matrix4().makeScale(10,10,10);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        cameraPos: { value: camera.position },
        carMatrix: { value: carMatrix },
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
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
