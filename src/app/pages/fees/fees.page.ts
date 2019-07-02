import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';

import { IonContent } from '@ionic/angular';

import {
  FeesBankDraft, 
  FeesDetails, 
  FeesSummary, 
  FeesTotalSummary,
} from '../../interfaces';
import { WsApiService } from 'src/app/services';
import { ChartComponent } from 'angular2-chartjs';

declare var Chart: any;

@Component({
  selector: 'app-fees',
  templateUrl: './fees.page.html',
  styleUrls: ['./fees.page.scss'],
})
export class FeesPage implements OnInit {
  selectedSegment = 'Summary';

  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  detail$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  visibleLabels: string[];

  @ViewChild("content") content: IonContent;
  @ViewChild("financialsChartComponent") financialsChartComponent: ChartComponent;
  financial$: Observable<FeesTotalSummary>;
  financialsChart = {
    type: 'bar',
    options: {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      },
      responsive: true,
      legend: {

      }
    },
    data: {}
  }

  numberOfSkeletons = new Array(6);

  constructor(private ws: WsApiService) { 
  }

  ngOnInit() {
    const that = this;

    this.totalSummary$ = this.ws.get('/student/summary_overall_fee', true);
    this.summary$ = this.ws.get('/student/outstanding_fee', true);
    this.bankDraft$ = this.ws.get('/student/bankdraft_amount', true);
    this.detail$ = this.ws.get('/student/overall_fee', true);

    this.totalSummary$ = this.totalSummary$.pipe(
      tap(overdueSummary => {
        this.financialsChart.data = {
          labels: ['Financial Status'],
          datasets: [
            {
              label: 'Paid',
              data: [+overdueSummary[0].TOTAL_PAID],
              backgroundColor: '#00c853' // GREEN
            },
            {
              label: 'Outstanding',
              data: [+overdueSummary[0].TOTAL_OUTSTANDING],
              backgroundColor: '#ffd600' // YELLOW
            },
            {
              label: 'Overdue',
              data: [+overdueSummary[0].TOTAL_OVERDUE],
              backgroundColor: '#d50000' // ORANGE
            },
            {
              label: 'Fine',
              data: [+overdueSummary[0].FINE],
              backgroundColor: '#c51162' // PINK
            }
          ]
        };
      })
    );

    this.financialsChart.options['legend']['onClick'] = function(event, legendItem) {
      Chart.defaults.global.legend.onClick.call(this, event, legendItem);

      const datasets: any[] = that.financialsChartComponent.chart.data.datasets;
      const labels: string[] = datasets.filter(dataset => !dataset._meta['0'].hidden).map(dataset => dataset.label);

      that.visibleLabels = labels;
    };
  }

  segmentValueChanged() {
    this.content.scrollToTop();
  }

  isNumber(val: any): boolean {
    return typeof val === 'number';
  }
}
