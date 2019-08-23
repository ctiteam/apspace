import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { IonContent, MenuController } from '@ionic/angular';

import { ChartComponent } from 'angular2-chartjs';

import {
  FeesBankDraft,
  FeesDetails,
  FeesSummary,
  FeesTotalSummary
} from '../../interfaces';
import { WsApiService } from 'src/app/services';

declare var Chart: any;

@Component({
  selector: 'app-fees',
  templateUrl: './fees.page.html',
  styleUrls: ['./fees.page.scss'],
  animations: [
    trigger('buttonEnterOut', [
      transition(':enter', [
        style({ transform: 'rotate(-90deg) scale(0)' }),
        animate('0.2s ease-out', style({ transform: 'rotate(0) scale(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.15s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FeesPage implements OnInit {
  selectedSegment = 'Summary';

  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  detail$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  labels: {
    name: string;
    visible: boolean;
  }[];
  visibleLabels: string[];  // Used by filter pipe to determine card items to be displayed

  @ViewChild('content', { static: true }) content: IonContent;
  @ViewChild('financialsChartComponent', { static: false })
  financialsChartComponent: ChartComponent;
  financial$: Observable<FeesTotalSummary>;
  financialsChart: {
    type: string;
    options: any;
    data: {
      labels: string[];
      datasets: {
        label: string;
        data: [number];
        backgroundColor: string;
      }[];
    };
  } = {
      type: 'bar',
      options: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }]
        },
        responsive: true,
        legend: {}
      },
      data: null
    };

  numberOfSkeletons = new Array(6);

  constructor(private menuCtrl: MenuController, private ws: WsApiService) { }

  ngOnInit() {
    this.doRefresh();
  }

  openFilterMenu() {
    this.menuCtrl.toggle();
  }

  doRefresh(event?) {
    console.log('Begin async operation');
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
              backgroundColor: '#49b571' // Green
            },
            {
              label: 'Outstanding',
              data: [+overdueSummary[0].TOTAL_OUTSTANDING],
              backgroundColor: '#dfa847' // Yellow
            },
            {
              label: 'Overdue',
              data: [+overdueSummary[0].TOTAL_OVERDUE],
              backgroundColor: '#e54d42' // Red
            },
            {
              label: 'Fine',
              data: [+overdueSummary[0].FINE],
              backgroundColor: '#ec2a4d' // Pink
            }
          ]
        };

        this.labels = this.financialsChart.data.datasets.map(
          dataset => ({
            name: dataset.label,
            visible: true
          })
        );
      }),
      finalize(() => event && event.target.complete()),


    );

    this.financialsChart.options.legend.onClick = function(
      event,
      legendItem
    ) {
      Chart.defaults.global.legend.onClick.call(this, event, legendItem);

      that.labels[legendItem.datasetIndex].visible = legendItem.hidden;
      that.visibleLabels = that.getVisibleLabels();
    };

  }


  updateChartLabelVisibility(labelIndex: number, visible: boolean) {
    this.financialsChartComponent.chart.data.datasets[labelIndex]._meta['0'].hidden = !visible;
    this.financialsChartComponent.chart.update();
    this.visibleLabels = this.getVisibleLabels();
  }

  segmentValueChanged() {
    this.content.scrollToTop();
  }

  getVisibleLabels(): string[] {
    return this.financialsChartComponent.chart.data.datasets
      .filter(dataset => !dataset._meta['0'].hidden)
      .map(dataset => dataset.label);
  }

  isNumber(val: any): boolean {
    return typeof val === 'number';
  }
}
