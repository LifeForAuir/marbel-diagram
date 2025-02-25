import { NgModule } from '@angular/core';
import {CommonModule, SlicePipe} from '@angular/common';
import { MarbleDiagramComponent } from './components/marble-diagram.component';

@NgModule({
  declarations: [MarbleDiagramComponent],
  imports: [
    SlicePipe,
    CommonModule,
  ],
  exports: [MarbleDiagramComponent]
})
export class MarbleDiagramModule { }
