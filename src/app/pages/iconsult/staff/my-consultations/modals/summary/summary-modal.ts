import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'page-summary-modal',
  templateUrl: 'summary-modal.html',
  styleUrls: ['summary-modal.scss']
})
export class ConsultationsSummaryModalPage implements OnInit {
  summaryDetails: any; // Coming from the page

  chartData = { // Chart configurations
    type: 'pie',
    options: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    data: {
      labels: [
        'Available',
        'Booked',
        'Unavailable'
      ],
      datasets: []
    }
  };


  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.chartData.data.datasets.push( // Pushing the data to the chart
      {
        data: [
          +this.summaryDetails.totalBookedSlots,
          +this.summaryDetails.totalAvailableSlots,
          +this.summaryDetails.totalUnavailalbeSlots
        ],
        backgroundColor: ['#e54d42', '#49b571', '#a1a1a1']
      }
    );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
