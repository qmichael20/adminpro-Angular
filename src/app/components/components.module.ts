import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementatorComponent } from './incrementator/incrementator.component';
import { FormsModule } from '@angular/forms';
import { DonutComponent } from './donut/donut.component';
import { NgChartsModule } from 'ng2-charts';
import { ModalImageComponent } from './modal-image/modal-image.component';

@NgModule({
  declarations: [IncrementatorComponent, DonutComponent, ModalImageComponent],
  exports: [IncrementatorComponent, DonutComponent, ModalImageComponent],
  imports: [CommonModule, FormsModule, NgChartsModule],
})
export class ComponentsModule { }
