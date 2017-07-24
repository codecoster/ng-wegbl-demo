import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import * as THREE from 'three';

@Injectable()
export class WebglService {
  private camera: THREE.Camera;

  private scene = new THREE.Scene();
  private webGlRenderer = new THREE.WebGLRenderer();

  private animationId: number;
  private rotationDirection: -1 | 1 = 1;

  private fontPromise: Promise<THREE.Font>;

  init(element: ElementRef, ngRenderer: Renderer2) {
    this.camera = new THREE.PerspectiveCamera(23, 1.77, 10, 3000);
    this.camera.position.set(700, 50, 1900);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);
    const light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2);
    light.position.set(0, 1500, 1000);
    this.scene.add(light);

    this.webGlRenderer.setSize(element.nativeElement.offsetParent.offsetWidth, element.nativeElement.offsetParent.offsetWidth / 1.77);
    ngRenderer.appendChild(element.nativeElement, this.webGlRenderer.domElement);
    this.getRenderFunction()();

    this.fontPromise = this.loadFont();
  }

  loadFont(): Promise<THREE.Font> {
    const loader = new THREE.FontLoader();
    return new Promise((resolve, reject) => {
      loader.load('assets/helvetiker_bold.typeface.json', (font: any) => {
        resolve(font);
      });
    });
  }

  makeT(): THREE.Object3D {
    const mesh = new THREE.Mesh();
    const pivot = new THREE.Object3D();
    this.fontPromise
      .then((font) => {
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
        mesh.name = 'trionT';
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
    return pivot;
  }

  rotate(obj: THREE.Object3D) {
    this.getRenderFunction(() => {
      if (obj.rotation.y > Math.PI / 2 || obj.rotation.y < -Math.PI / 3) {
        this.rotationDirection *= -1;
      }
      obj.rotation.y += 0.01 * this.rotationDirection;
    })();
  }

  makeLine(): THREE.Line {
    const material = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 10});
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-200, 0, 200));
    geometry.vertices.push(new THREE.Vector3(0, 200, 200));
    geometry.vertices.push(new THREE.Vector3(200, 0, 200));
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    return line;
  }

  deleteObject(obj: THREE.Object3D) {
    this.scene.remove(obj);
  }

  cancelPendingAnimations() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private getRenderFunction(animation?: () => void): () => void {
    return () => {
      this.cancelPendingAnimations();
      this.animationId = requestAnimationFrame(this.getRenderFunction(animation));
      if (typeof animation === 'function') {
        animation();
      }
      this.webGlRenderer.render(this.scene, this.camera);
    };
  }
}
