import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SimpleWebglComponent } from './simple-webgl/simple-webgl.component';
import { WebglService } from './webgl.service';

@NgModule({
  declarations: [
    AppComponent,
    SimpleWebglComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [WebglService],
  bootstrap: [AppComponent]
})
export class AppModule { }
