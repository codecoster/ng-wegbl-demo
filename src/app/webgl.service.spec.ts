import {
  TestBed, inject, async, ComponentFixture
} from '@angular/core/testing';

import { WebglService } from './webgl.service';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Font, Mesh, Vector3 } from 'three';

describe('WebglService', () => {

    const font = require('assets/helvetiker_bold.typeface.json');

    @Component({
      template: ''
    })
    class TestComponent {
      constructor(public el: ElementRef, public renderer: Renderer2) {
      }
    }

    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [WebglService],
        declarations: [TestComponent]
      });
      TestBed.compileComponents();
      const service = TestBed.get(WebglService);
      spyOn(service, 'loadFont').and.returnValue(Promise.resolve(new Font(font)));
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be created', inject([WebglService], (service: WebglService) => {
      expect(service).toBeTruthy();
    }));

    it('should create trion', async(inject([WebglService], (service: WebglService) => {
      service.init(component.el, component.renderer);
      const obj = service.makeT();

      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const mesh = obj.children[0] as Mesh;
          service.rotate(mesh);

          expect(mesh instanceof Mesh).toBeTruthy();
          expect(mesh.position.z).toBe(0, 'z');
          expect(mesh.position.y).toBe(-20, 'y');
          expect(mesh.position.x).toBe(-294, 'x');
          expect(mesh.rotation.x).toBe(0, 'rx');
          expect(mesh.rotation.y).toBe(0.01, 'ry');
          expect(mesh.rotation.z).toBe(0, 'rz');
          expect(mesh.geometry.boundingBox.getCenter()).toEqual(new Vector3());
        });
    })));
  }
)
;
