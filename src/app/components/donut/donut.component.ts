import { Component, Input } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styles: [],
})
export class DonutComponent {
  @Input() title: string = '';

  @Input() data!: ChartData;

  public doughnutChartType: ChartType = 'doughnut';
}
