import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { WsApiService } from 'src/app/services';
@Component({
  selector: 'page-student-details-modal',
  templateUrl: 'student-details-modal.html',
})
export class StudentDetailsModalPage {
  devURL = 'https://febjtv2yxj.execute-api.ap-southeast-1.amazonaws.com/dev';

  studentId: string;
  studentDetails$: any;
  constructor(
    public params: NavParams,
    private modalCtrl: ModalController,
    private ws: WsApiService
  ) {
    this.studentId = this.params.get('studentId');
  }

  ionViewWillEnter() {
    this.studentDetails$ = this.ws.get(`/igraduate/student_details?id=${this.studentId}`, { url: this.devURL }).pipe(
      tap(res => console.log(res))
    );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
