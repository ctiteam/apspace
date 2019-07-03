import { Component, OnInit, ViewChild } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { IonContent, MenuController } from "@ionic/angular";

import { ChartComponent } from "angular2-chartjs";

import {
  FeesBankDraft,
  FeesDetails,
  FeesSummary,
  FeesTotalSummary
} from "../../interfaces";
import { WsApiService } from "src/app/services";

declare var Chart: any;

@Component({
  selector: "app-fees",
  templateUrl: "./fees.page.html",
  styleUrls: ["./fees.page.scss"],
  animations: [
    trigger("buttonEnterOut", [
      transition(":enter", [
        style({ transform: "rotate(-90deg) scale(0)" }),
        animate("0.2s ease-out", style({ transform: "rotate(0) scale(1)" }))
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("0.15s ease-in", style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FeesPage implements OnInit {
  selectedSegment = "Summary";

  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  detail$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  labels: {
    name: string;
    visible: boolean;
  }[];
  visibleLabels: string[];  // Used by filter pipe to determine card items to be displayed

  @ViewChild("content") content: IonContent;
  @ViewChild("financialsChartComponent")
  financialsChartComponent: ChartComponent;
  financial$: Observable<FeesTotalSummary>;
  financialsChart = {
    type: "bar",
    options: {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      },
      responsive: true,
      legend: {}
    },
    data: {}
  };

  numberOfSkeletons = new Array(6);

  constructor(public menuCtrl: MenuController, private ws: WsApiService) {}

  ngOnInit() {
    const that = this;

    this.totalSummary$ = this.ws.get("/student/summary_overall_fee", true);
    this.summary$ = this.ws.get("/student/outstanding_fee", true);
    this.bankDraft$ = this.ws.get("/student/bankdraft_amount", true);
    this.detail$ = this.ws.get("/student/overall_fee", true);

    this.totalSummary$ = this.totalSummary$.pipe(
      tap(overdueSummary => {
        this.financialsChart.data = {
          labels: ["Financial Status"],
          datasets: [
            {
              label: "Paid",
              data: [+overdueSummary[0].TOTAL_PAID],
              backgroundColor: "#00c853" // GREEN
            },
            {
              label: "Outstanding",
              data: [+overdueSummary[0].TOTAL_OUTSTANDING],
              backgroundColor: "#ffd600" // YELLOW
            },
            {
              label: "Overdue",
              data: [+overdueSummary[0].TOTAL_OVERDUE],
              backgroundColor: "#d50000" // ORANGE
            },
            {
              label: "Fine",
              data: [+overdueSummary[0].FINE],
              backgroundColor: "#c51162" // PINK
            }
          ]
        };

        this.labels = this.financialsChart.data["datasets"].map(
          dataset => ({
            "name": dataset.label,
            "visible": true
          })
        );
      })
    );

    this.financialsChart.options["legend"]["onClick"] = function(
      event,
      legendItem
    ) {
      Chart.defaults.global.legend.onClick.call(this, event, legendItem);

      that.labels[legendItem.datasetIndex].visible = legendItem.hidden;
      that.visibleLabels = that.getVisibleLabels();
    };
  }

  openFilterMenu() {
    this.menuCtrl.toggle();
  }

  updateChartLabelVisibility(label_index: number, visible: boolean) {
    this.financialsChartComponent.chart.data.datasets[label_index]._meta["0"].hidden = !visible;
    this.financialsChartComponent.chart.update();
    this.visibleLabels = this.getVisibleLabels();
  }

  segmentValueChanged() {
    this.content.scrollToTop();
  }

  getVisibleLabels(): string[] {
    return this.financialsChartComponent.chart.data.datasets
      .filter(dataset => !dataset._meta["0"].hidden)
      .map(dataset => dataset.label);
  }

  isNumber(val: any): boolean {
    return typeof val === "number";
  }
}
