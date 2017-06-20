import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { WebglService } from '../webgl.service';
import { Mesh } from 'three';


@Component({
  selector: 'app-simple-webgl',
  templateUrl: './simple-webgl.component.html',
  styleUrls: ['./simple-webgl.component.css']
})
export class SimpleWebglComponent implements AfterViewInit {

  mesh: Mesh;

  constructor(private webgl: WebglService,
              private el: ElementRef,
              private renderer2: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.webgl.init(this.el, this.renderer2);
    this.mesh = this.webgl.makeT();
  }

  onClick() {
    this.webgl.rotate(this.mesh);
  }

  onClickLine() {
    this.webgl.makeLine();
  }

  cancel() {
    this.webgl.cancelPendingAnimations();
  }

}
