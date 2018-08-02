import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { StudentProfile, Role, StaffProfile } from '../../interfaces';
import { WsApiProvider, SettingsProvider, FeedbackProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})

export class FeedbackPage {

  role: any;

  userInfo: any = {
    name: '',
    email: '',
    contactNumber: '',
    message: '',
  }

  constructor(
    private ws: WsApiProvider,
    private settings: SettingsProvider,
    private feedback: FeedbackProvider,
  ) { }

  submitFeedback(){
    this.feedback.sendFeedback(this.userInfo.contactNumber, this.userInfo.message);
  }

  ionViewDidLoad() {
    this.role = this.settings.get('role');
    if (this.role & Role.Student) {
      this.ws.get<StudentProfile[]>('/student/profile').subscribe(p => {
        this.userInfo.name = p[0].NAME;
        this.userInfo.email = p[0].STUDENT_NUMBER + "@mail.apu.edu.my";
      });
    } else if (this.role & (Role.Lecturer || Role.Admin)) {
      this.ws.get<StaffProfile[]>('/staff/profile').subscribe(p => {
        this.userInfo.name = p[0].FULLNAME;
        this.userInfo.email = p[0].EMAIL;
      })
    }
  }
}
