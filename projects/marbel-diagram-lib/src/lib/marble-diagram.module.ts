import { NgModule } from '@angular/core';
import {CommonModule, SlicePipe} from '@angular/common';
import { MarbleDiagramComponent } from './components/marble-diagram.component';
import { TimeScaleComponent } from './components/time-scale.component';

@NgModule({
  declarations: [MarbleDiagramComponent, TimeScaleComponent],
  imports: [
    SlicePipe,
    CommonModule,
  ],
  exports: [MarbleDiagramComponent, TimeScaleComponent]
})
export class MarbleDiagramModule { }
