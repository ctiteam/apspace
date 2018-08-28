import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';

import { Role, StaffProfile, StudentProfile } from '../../interfaces';
import { FeedbackProvider, SettingsProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  info: any = {
    contactNumber: '',
    email: '',
    message: '',
    name: '',
  };

  constructor(
    private feedback: FeedbackProvider,
    private settings: SettingsProvider,
    private toastCtrl: ToastController,
    private ws: WsApiProvider,
  ) { }

  submitFeedback() {
    this.feedback.sendFeedback(this.info.name, this.info.email, this.info.contactNumber, this.info.message)
      .subscribe(_ => {
        this.toastCtrl.create({ message: 'Feedback submitted!', position: 'bottom', duration: 3000 }).present();
        this.info.contactNumber = '';
        this.info.message = '';
      });
  }

  ionViewDidLoad() {
    const role = this.settings.get('role');
    if (role & Role.Student) {
      this.ws.get<StudentProfile[]>('/student/profile').subscribe(p => {
        this.info.name = p[0].NAME;
        this.info.email = p[0].STUDENT_NUMBER + '@mail.apu.edu.my';
      });
    } else if (role & (Role.Lecturer || Role.Admin)) {
      this.ws.get<StaffProfile[]>('/staff/profile', false, { url: 'https://api.apiit.edu.my' })
        .subscribe(p => {
          this.info.name = p[0].FULLNAME;
          this.info.email = p[0].EMAIL + '@apu.edu.my';
        });
    }
  }

}
