import { Component } from '@angular/core';

import { ChartData } from 'chart.js';

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styles: [``],
})
export class Chart1Component {
  public doughnutChartLabels1: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  public doughnutChartData1: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels1,
    datasets: [{ data: [350, 450, 100] }],
  };

  public doughnutChartLabels2: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  public doughnutChartData2: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels1,
    datasets: [{ data: [150, 250, 10] }],
  };
}
