import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WsApiService } from 'src/app/services';
import { StudentDetailsModalPage } from './student-details-modal';

@Component({
  selector: 'app-igraduate',
  templateUrl: './igraduate.page.html',
  styleUrls: ['./igraduate.page.scss'],
})
export class IgraduatePage implements OnInit {
  idToSearch = '';
  selectedSegment: 'studentsList' | 'exceptions' | 'report' = 'studentsList';
  studentIDException = '';
  devURL = 'https://febjtv2yxj.execute-api.ap-southeast-1.amazonaws.com/dev';
  studentsList$: Observable<any>;
  exceptionsList$: Observable<any>;
  constructor(private ws: WsApiService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.studentsList$ = this.ws.get<any>('/igraduate/student_list', { url: this.devURL }).pipe(
      tap(res => console.log(res))
    );
    this.exceptionsList$ = this.ws.get<any>(`/igraduate/exception`, { url: this.devURL }).pipe(
      tap(res => console.log(res))
    );
  }
  segmentValueChanged() {
    console.log('changed');
  }

  async openStudentDetailModal(studentId) {
    const modal = await this.modalCtrl.create({
      component: StudentDetailsModalPage,
      // TODO: store search history
      componentProps: { studentId, notFound: 'No news Selected' },
    });
    await modal.present();
    // default item to current intake if model dismissed without data
    await modal.onDidDismiss();
  }
}
