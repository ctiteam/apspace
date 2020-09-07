import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ChartComponent } from 'angular2-chartjs';
import { parse } from 'date-fns';
import Fuse from 'fuse.js';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { WsApiService } from 'src/app/services';
import {
  FeesBankDraft,
  FeesDetails,
  FeesSummary,
  FeesTotalSummary
} from '../../interfaces';

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
export class FeesPage {
  selectedSegment = 'Summary';

  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  detail$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  // categories used for chart
  categories: {
    course: {
      data: number;
    };
    accommodation: {
      data: number;
    };
    emgs: {
      data: number;
    };
    bus: {
      data: number;
    };
    others: {
      data: number;
    }
  };

  searchTerm = '';

  optionsDetails: Fuse.IFuseOptions<FeesDetails> = {
    keys: [
      { name: 'ITEM_DESCRIPTION', weight: 0.2 },
      { name: 'DUE_DATE', weight: 0.1 },
      { name: 'AMOUNT_PAYABLE', weight: 0.1 },
      { name: 'OUTSTANDING', weight: 0.1 },
      { name: 'TOTAL_COLLECTED', weight: 0.1 }
    ]
  };

  @ViewChild('content', { static: true }) content: IonContent;
  @ViewChild('financialsChartComponent')
  financialsChartComponent: ChartComponent;
  financial$: Observable<FeesTotalSummary>;
  financialsChart: {
    type: string;
    options: any;
    data: {
      labels: string[];
      datasets: {
        data: number[];
        backgroundColor: string[];
        weight: [number]
      }[];
    };
  } = {
      type: 'doughnut',
      options: {
        responsive: true,
        aspectRatio: 1.5,
        legend: {}
      },
      data: null
    };

  numberOfSkeletons = new Array(6);

  constructor(private ws: WsApiService) { }

  ionViewDidEnter() {
    this.doRefresh();
  }

  doRefresh(refresher?) {

    this.totalSummary$ = this.ws.get('/student/summary_overall_fee', refresher);
    this.summary$ = this.ws.get<FeesSummary[]>('/student/outstanding_fee', refresher).pipe(
      tap(summaries => summaries
        .map(summary => summary.PAYMENT_DUE_DATE ? summary.PAYMENT_DUE_DATE = summary.PAYMENT_DUE_DATE.replace(/-/g, ' ') : ''))
    );
    this.bankDraft$ = this.ws.get('/student/bankdraft_amount', refresher);
    this.detail$ = this.ws.get<FeesDetails[]>('/student/overall_fee', refresher).pipe(
      tap(details => details.map(detail => detail.DUE_DATE = parse(detail.DUE_DATE, 'dd-MMM-yy', new Date()).toString()))
    );

    // this categories are loaded to chart later, initialized with 0
    this.categories = {
      course: {
        data: 0
      },
      accommodation: {
        data: 0
      },
      emgs: {
        data: 0
      },
      bus: {
        data: 0
      },
      others: {
        data: 0
      }
    };

    this.detail$.pipe(
      tap(res => res.forEach(amount => {

        // upload data to categories object
        this.categories.course.data += amount.ITEM_DESCRIPTION.includes('Course Fee') || amount.ITEM_DESCRIPTION.includes('SU')
          ? amount.TOTAL_COLLECTED
          : 0;

        this.categories.accommodation.data += amount.ITEM_DESCRIPTION.includes('Accommodation')
          ? amount.TOTAL_COLLECTED
          : 0;

        this.categories.emgs.data += amount.ITEM_DESCRIPTION.includes('EMGS') || amount.ITEM_DESCRIPTION.includes('Immigration')
          ? amount.TOTAL_COLLECTED
          : 0;

        this.categories.bus.data += amount.ITEM_DESCRIPTION.includes('Shuttle')
          ? amount.TOTAL_COLLECTED
          : 0;

        this.categories.others.data += !amount.ITEM_DESCRIPTION.includes('Course Fee') &&
          !amount.ITEM_DESCRIPTION.includes('SU') &&
          !amount.ITEM_DESCRIPTION.includes('Accommodation') &&
          !amount.ITEM_DESCRIPTION.includes('EMGS') &&
          !amount.ITEM_DESCRIPTION.includes('Immigration') &&
          !amount.ITEM_DESCRIPTION.includes('Shuttle')
          ? amount.TOTAL_COLLECTED
          : 0;

        // data taken from categories object
        this.financialsChart.data = {
          labels: ['Course Fee', 'Accommodation', 'EMGS', 'Shuttle Card', 'Others'],
          datasets: [
            {
              data: [
                this.categories.course.data,
                this.categories.accommodation.data,
                this.categories.emgs.data,
                this.categories.bus.data,
                this.categories.others.data,
              ],
              backgroundColor: ['#0081a7', '#00afb9', '#fdfcdc', '#f07167', '#fed9b7'],
              weight: [600]
            },
          ]
        };
      })),

      finalize(() => refresher && refresher.target.complete())

    ).subscribe();
  }

  segmentValueChanged() {
    this.content.scrollToTop();
  }
}
