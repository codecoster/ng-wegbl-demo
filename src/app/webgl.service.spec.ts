import {
  TestBed, inject, async, ComponentFixture
} from '@angular/core/testing';

import { WebglService } from './webgl.service';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Font, Vector3 } from 'three';

describe('WebglService', () => {

    const font = require('assets/helvetiker_bold.typeface.json');

    @Component({
      template: ''
    })
    class TestComponent {
      constructor(public el: ElementRef, public renderer: Renderer2) {
      }
    }

    let service: WebglService;
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [WebglService],
        declarations: [TestComponent]
      });
      TestBed.compileComponents();
      service = TestBed.get(WebglService);
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(service, 'loadFont').and.returnValue(Promise.resolve(new Font(font)));
    });

    it('should be created', async(inject([WebglService], (service2: WebglService) => {
      expect(service2).toBeTruthy();
    })));

    it('should create trion', async(inject([WebglService], (service2: WebglService) => {
      service2.init(component.el, component.renderer);
      fixture.detectChanges();
      const mesh = service2.makeT();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(mesh.position.z).toBe(0);
          expect(mesh.position.y).toBe(-20);
          expect(mesh.position.x).toBe(-294);
          expect(mesh.rotation.x).toBe(0);
          expect(mesh.rotation.y).toBe(0);
          expect(mesh.rotation.z).toBe(0);
          expect(mesh.geometry.boundingBox.getCenter()).toEqual(new Vector3());
        });
    })));
  }
)
;
