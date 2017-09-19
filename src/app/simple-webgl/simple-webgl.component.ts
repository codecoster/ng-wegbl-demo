import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { WebglService } from '../webgl.service';
import { Line, Object3D } from 'three';


@Component({
  selector: 'app-simple-webgl',
  templateUrl: './simple-webgl.component.html'
})
export class SimpleWebglComponent implements AfterViewInit {

  @ViewChild('container') canvasContainer: ElementRef;

  trionGroup: Object3D;
  line: Line;

  constructor(private webgl: WebglService,
              private renderer2: Renderer2) {
  }

  @HostListener('window:resize')
  resize() {
    this.webgl.resize(this.canvasContainer.nativeElement.clientWidth);
  }

  ngAfterViewInit(): void {
    this.webgl.init(this.canvasContainer, this.renderer2);
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
    this.webgl.cancelCurrentAnimation();
    this.webgl.deleteObject(this.trionGroup);
    this.removeLine();
    this.trionGroup = this.webgl.makeT();
  }

  private removeLine() {
    this.webgl.deleteObject(this.line);
    this.line = null;
  }
}
