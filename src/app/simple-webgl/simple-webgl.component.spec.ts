import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleWebglComponent } from './simple-webgl.component';
import { WebglService } from '../webgl.service';

describe('SimpleWebglComponent', () => {
  let component: SimpleWebglComponent;
  let fixture: ComponentFixture<SimpleWebglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleWebglComponent],
      providers: [WebglService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleWebglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
