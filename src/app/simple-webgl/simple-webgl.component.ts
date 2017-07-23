import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { WebglService } from '../webgl.service';
import { Line, Object3D } from 'three';


@Component({
  selector: 'app-simple-webgl',
  templateUrl: './simple-webgl.component.html',
  styleUrls: ['./simple-webgl.component.css']
})
export class SimpleWebglComponent implements AfterViewInit {

  trionGroup: Object3D;
  line: Line;

  constructor(private webgl: WebglService,
              private el: ElementRef,
              private renderer2: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.webgl.init(this.el, this.renderer2);
    this.trionGroup = this.webgl.makeT();
  }

  onClick() {
    this.webgl.rotate(this.trionGroup.getObjectByName('trionT'));
  }

  onClickLine() {
    if (!this.line) {
      this.line = this.webgl.makeLine();
    } else {
      this.removeLine();
    }
  }

  reset() {
    this.removeLine();
    this.webgl.deleteObject(this.trionGroup);
    this.trionGroup = this.webgl.makeT();
  }

  private removeLine() {
    this.webgl.deleteObject(this.line);
    this.line = null;
  }
}
