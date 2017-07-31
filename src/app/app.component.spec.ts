import {
  TestBed, async, fakeAsync, tick, flushMicrotasks, discardPeriodicTasks,
  resetFakeAsyncZone
} from '@angular/core/testing';

import { AppComponent } from './app.component';
import { SimpleWebglComponent } from './simple-webgl/simple-webgl.component';
import { WebglService } from './webgl.service';
import { Font } from 'three';

describe('AppComponent', () => {

  const font = require('assets/helvetiker_bold.typeface.json');
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SimpleWebglComponent
      ],
      providers: [
        WebglService
      ]
    }).compileComponents();
    const service = TestBed.get(WebglService);
    spy = spyOn(service, 'loadFont').and.returnValue(Promise.resolve(new Font(font)));
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Hello WebGl and Angular!');
  }));
});
