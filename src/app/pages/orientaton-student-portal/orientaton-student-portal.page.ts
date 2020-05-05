import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { WsApiService } from 'src/app/services';
import { ViewStudentProfileModalPage } from './view-student-profile/view-student-profile-modal';

@Component({
  selector: 'app-orientaton-student-portal',
  templateUrl: './orientaton-student-portal.page.html',
  styleUrls: ['./orientaton-student-portal.page.scss'],
})
export class OrientatonStudentPortalPage implements OnInit {

  studentsList$: Observable<{
    COURSE: null | string,
    INTAKE: string,
    STUDENT_NAME: string,
    STUDENT_NUMBER: string
  }[]>;
  constructor(
    private ws: WsApiService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.studentsList$ = this.ws.get('orientation/student_list', { url: 'https://gv8ap4lfw5.execute-api.ap-southeast-1.amazonaws.com/dev/' });
  }



  async viewProfile(studentID: string) {
    const modal = await this.modalCtrl.create({
      component: ViewStudentProfileModalPage,
      cssClass: 'generateTransactionsPdf',
      componentProps: { studentID }
    });
    await modal.present();
    await modal.onDidDismiss();
  }

}
