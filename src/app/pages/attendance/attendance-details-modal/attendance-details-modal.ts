import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { Observable } from 'rxjs';


import { AttendanceDetails } from 'src/app/interfaces/attendance-details';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-attendance-details-modal',
  templateUrl: './attendance-details-modal.html',
  styleUrls: ['./attendance-details-modal.scss'],
  providers: [DatePipe]
})
export class AttendanceDetailsModalPage implements OnInit {
  loading: HTMLIonLoadingElement;
  records$: Observable<AttendanceDetails[]>;

  title = this.navPrms.data.title;
  intake = this.navPrms.data.intake;
  module = this.navPrms.data.module;

  datesConfig: DayConfig[] = [];
  openDate: string;


  timeFrom: string;
  timeTo: string;
  classType: string;
  showCard = false;

  loaded = false;


  options: CalendarComponentOptions = {
    daysConfig: this.datesConfig,
    weekStart: 1,
    showToggleButtons: false
  };

  constructor(
    private modalCtrl: ModalController,
    private navPrms: NavParams,
    private ws: WsApiService,
    private loadingCtrl: LoadingController,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.records$ = this.getRecords();
    this.showOnCalendar();
  }

  getRecords() {
    return this.ws.get<AttendanceDetails[]>(`/student/attendance_details?intake_code=${this.intake}&module_code=${this.module}`, {
      url: 'https://u1cd2ltoq6.execute-api.ap-southeast-1.amazonaws.com/dev'
    });
  }

  showOnCalendar() {
    this.presentLoading();

    this.records$.subscribe(records => records.forEach(record => {

      // pushes css configs based on attendance status, css declared in global
      const css =
        record.ATTENDANCE_STATUS === 'Y'
          ? `attended`
          : record.ATTENDANCE_STATUS === 'N'
            ? `absent`
            : record.ATTENDANCE_STATUS === 'R'
              ? `absent-reason`
              : record.ATTENDANCE_STATUS === 'L'
                ? `late`
                : null;

      this.datesConfig.push({
        date: new Date(record.CLASS_DATE),
        subTitle: '.',
        marked: true,
        cssClass: css,
        disable: false
      });

      // picks first date from api and opens it in calendar
      this.openDate = this.datePipe.transform(new Date(record.CLASS_DATE), 'yyyy-MM-dd');

      this.loaded = true;
      this.dismissLoading();
    }
    ));
  }

  // show additional info about class on click
  onChange($event: string) {
    this.records$.subscribe(records => records.forEach(record => {
      const date = this.datePipe.transform(new Date(record.CLASS_DATE), 'yyyy-MM-dd');

      if ($event === date) {
        this.classType = record.CLASS_TYPE;
        this.timeFrom = record.TIME_FROM;
        this.timeTo = record.TIME_TO;
        this.showCard = true;
      }
    }));
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
