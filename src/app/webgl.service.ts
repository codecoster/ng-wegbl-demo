import { Injectable } from '@angular/core';

import * as THREE from 'three';
import { SpotLightShadow } from 'three';

@Injectable()
export class WebglService {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(23, window.innerWidth / window.innerHeight, 10, 3000);

  renderer = new THREE.WebGLRenderer();

  animationId: number;
  rotationDirection: -1 | 1 = 1;

  init() {
    this.camera.position.set(700, 50, 1900);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);
    const light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2);
    light.position.set(0, 1500, 1000);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 1200, 2500))as SpotLightShadow;
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);

    document.body.appendChild(this.renderer.domElement);
    this.getRenderFunction()();
  }

  makeLine() {
    const material = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 10});
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-200, 0, 200));
    geometry.vertices.push(new THREE.Vector3(0, 200, 200));
    geometry.vertices.push(new THREE.Vector3(200, 0, 200));
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

  makeT(): THREE.Mesh {
    const loader = new THREE.FontLoader();
    const mesh = new THREE.Mesh();
    const pivot = new THREE.Object3D();
    loader.load('assets/helvetiker_bold.typeface.json', (font: any) => {

      const textGeo = new THREE.TextGeometry('trion', {
        font: font,
        size: 200,
        height: 50,
        curveSegments: 12,
        bevelThickness: 2,
        bevelSize: 5,
        bevelEnabled: true
      });
      textGeo.computeBoundingBox();
      const centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
      const textMaterial = new THREE.MeshPhongMaterial({color: 0x80cc28, specular: 0xffffff});
      mesh.geometry = textGeo;
      mesh.material = textMaterial;
      mesh.position.x = centerOffset;
      mesh.position.y = -20;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Store original position
      const offset = mesh.geometry.boundingBox.getCenter();

      // Center geometry faces
      mesh.geometry.center();

      // Add to pivot group
      pivot.add(mesh);

      // Offset pivot group by original position
      pivot.position.set(offset.x, offset.y, offset.z);

      this.scene.add(pivot);
    });
    return mesh;
  }

  rotate(mesh: THREE.Mesh) {
    this.getRenderFunction(() => {
      mesh.rotation.y += 0.01;
    })();
  }

  private getRenderFunction(animation?: () => void): () => void {
    return () => {
      this.animationId = requestAnimationFrame(this.getRenderFunction(animation));
      if (typeof animation === 'function') {
        animation();
      }
      this.renderer.render(this.scene, this.camera);
    };
  }
}
