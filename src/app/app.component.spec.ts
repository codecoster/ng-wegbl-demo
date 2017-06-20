import { TestBed, async, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { SimpleWebglComponent } from './simple-webgl/simple-webgl.component';
import { WebglService } from './webgl.service';
import { Font } from 'three';

const font = require('assets/helvetiker_bold.typeface.json');

describe('AppComponent', () => {

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
    const service: WebglService = TestBed.get(WebglService);
    spyOn(service, 'loadFont').and.returnValue(Promise.resolve(new Font(font)));
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should getRenderFunction title in a h1 tag', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!!');
    discardPeriodicTasks();
  }));
});
