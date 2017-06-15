import { AfterViewInit, Component } from '@angular/core';
import { WebglService } from '../webgl.service';
import { Group, Mesh, Object3D } from 'three';


@Component({
  selector: 'app-simple-webgl',
  templateUrl: './simple-webgl.component.html',
  styleUrls: ['./simple-webgl.component.css']
})
export class SimpleWebglComponent implements AfterViewInit {

  mesh: Mesh;

  constructor(private webgl: WebglService) {
  }

  ngAfterViewInit(): void {
    this.webgl.init();
    this.mesh = this.webgl.makeT();
  }

  onClick() {
    this.webgl.rotate(this.mesh);
  }

  onClickLine() {
    this.webgl.makeLine();
  }

}
