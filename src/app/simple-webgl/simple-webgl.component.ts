import { AfterViewInit, Component } from '@angular/core';
import { WebglService } from '../webgl.service';
import { Mesh } from 'three';


@Component({
  selector: 'app-simple-webgl',
  templateUrl: './simple-webgl.component.html',
  styleUrls: ['./simple-webgl.component.css']
})
export class SimpleWebglComponent implements AfterViewInit {

  cube: Mesh;

  constructor(private webgl: WebglService) {
  }

  ngAfterViewInit(): void {
    this.webgl.init();
    this.cube = this.webgl.makeCube();
  }

  onClick() {
    this.webgl.rotate(this.cube);
  }

  onClickLine(){
    this.webgl.makeLine();
  }

  onClickT(){
    this.webgl.makeT()
  }

}
