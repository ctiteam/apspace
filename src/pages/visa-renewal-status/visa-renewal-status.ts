import { Component } from '@angular/core';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import {
  ActionSheetButton,
  ActionSheetController,
  IonicPage,
  Platform,
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize, tap } from 'rxjs/operators';
import {
  Attendance,
  ClassificationLegend,
  Course,
  CourseDetails,
  DeterminationLegend,
  InterimLegend,
  MPULegend,
  StudentProfile,
  Subcourse,
} from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  providers: [],
  selector: 'page-visa-renewal-status',
  templateUrl: 'visa-renewal-status.html',
})
export class VisaRenewalStatusPage {
  type = 'doughnut';

  options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    cutoutPercentage:70
  };
  doughnutChartData: any;
  visaRenewal: any = {};

  showLoading = false;

  block: boolean = false;
  message: string;

  numOfSkeletons = new Array(4);

  constructor(
    private ws: WsApiProvider,
    public plt: Platform,
    private actionSheet: ActionSheet,
    private actionSheetCtrl: ActionSheetController) { }

  ionViewDidLoad() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.showLoading = true;
    this.ws.get<StudentProfile>('/student/profile', true).subscribe(p => {
      if (p.EMGS_COUNTRY_CODE && p.EMGS_COUNTRY_CODE !== 'MYS') {
        const url = 'http://mobileapp.emgs.com.my/api_v2/web/app.php/applicationstatus/';
        this.ws.get<CourseDetails>(
          `${p.EMGS_COUNTRY_CODE}/${p.IC_PASSPORT_NO}`, true, { url, auth: false }).pipe(
            finalize(() => refresher && refresher.complete()),
          ).subscribe(
            res => this.visaRenewal = res,
            err => console.log(err),
            () => {
              console.log(this.visaRenewal);
              this.doughnutChartData = {
                labels: [],
                datasets: [
                  {
                    backgroundColor: ["green"],
                    data: [+this.visaRenewal.status_historys[0].complete, 100-+this.visaRenewal.status_historys[0].complete],
                  },
                ],
              };
              this.showLoading = false;
            }
          );
      } else {
        this.block = true;
        this.message = 'Malaysian students do not require usage of this page.';
      }
    });
  }
}
