import { Injectable } from '@angular/core';

import * as THREE from 'three';

@Injectable()
export class WebglService {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

  renderer = new THREE.WebGLRenderer();


  init() {
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.render()();
  }

  render(animation?: () => void): () => void {
    return () => {
      requestAnimationFrame(this.render(animation));
      if (typeof animation === 'function') {
        animation();
      }
      this.renderer.render(this.scene, this.camera);
    };
  }

  makeCube(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    return cube;
  }

  makeLine() {
    const material = new THREE.LineBasicMaterial({color: 0x0000ff});
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

  makeT() {
    const loader = new THREE.FontLoader();
    loader.load('assets/helvetiker_bold.typeface.json', (font: any) => {

      const textGeo = new THREE.TextGeometry('T', {
        font: font,
        size: 40,
        height: 20,
        curveSegments: 12,
        bevelThickness: 2,
        bevelSize: 5,
        bevelEnabled: true
      });
      textGeo.computeBoundingBox();
      const centerOffset = -0.2 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
      const textMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
      const mesh = new THREE.Mesh(textGeo, textMaterial);
      mesh.position.x = centerOffset;
      mesh.position.y = -20;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });
  }

  rotate(cube: THREE.Mesh) {
    this.render(() => {
      cube.rotation.x += 0.1;
      cube.rotation.y += 0.1;
    })();
  }
}
