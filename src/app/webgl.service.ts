import { ElementRef, Injectable, NgZone, Renderer2 } from '@angular/core';

import * as THREE from 'three';

@Injectable()
export class WebglService {
  private camera: THREE.Camera;

  private scene = new THREE.Scene();
  private webGlRenderer = new THREE.WebGLRenderer({antialias: true});

  private animationId: number;
  private rotationDirection: -1 | 1 = 1;

  private fontPromise: Promise<THREE.Font>;

  constructor(private zone: NgZone) {
  }

  init(element: ElementRef, ngRenderer: Renderer2) {
    this.webGlRenderer.setSize(document.body.clientWidth, document.body.clientWidth / 1.8);
    ngRenderer.appendChild(element.nativeElement, this.webGlRenderer.domElement);

    // Reset size of Frame after Scrollbars have been put into place by the browser
    this.webGlRenderer.setSize(document.body.clientWidth, document.body.clientWidth / 1.8);

    this.camera = new THREE.PerspectiveCamera(23, 1.77, 10, 3000);
    this.camera.position.set(700, 50, 1900);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);
    const light = new THREE.SpotLight(0xffffff);
    light.position.set(0, 1500, 1000);
    this.scene.add(light);

    this.webGlRenderer.render(this.scene, this.camera);

    this.fontPromise = this.loadFont();
  }

  resize(width: number) {
    this.webGlRenderer.setSize(width, width / 1.8);
    this.webGlRenderer.render(this.scene, this.camera);
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
        this.webGlRenderer.render(this.scene, this.camera);
      });
    return pivot;
  }

  makeLine(): THREE.Line {

    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-200, 0, 200));
    geometry.vertices.push(new THREE.Vector3(0, 200, 200));
    geometry.vertices.push(new THREE.Vector3(200, 0, 200));

    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 10
    });
    const line = new THREE.Line(geometry, material);

    this.scene.add(line);
    this.webGlRenderer.render(this.scene, this.camera);

    return line;
  }

  deleteObject(obj: THREE.Object3D) {
    this.scene.remove(obj);
    this.webGlRenderer.render(this.scene, this.camera);
  }

  rotate(obj: THREE.Object3D) {
    this.animationStarter(() => {
      if (obj.rotation.y > Math.PI / 2 || obj.rotation.y < -Math.PI / 3) {
        this.rotationDirection *= -1;
      }
      obj.rotation.y += 0.01 * this.rotationDirection;
    });
  }

  cancelAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private animationStarter(animation?: () => void) {
    this.cancelAnimation();
    const factory = () => {
      this.zone.runOutsideAngular(() => {
        if (typeof animation === 'function') {
          animation();
        }
        this.webGlRenderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(factory);
      });
    };
    factory();
  }
}
