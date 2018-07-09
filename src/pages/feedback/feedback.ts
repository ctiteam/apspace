import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { Device } from '@ionic-native/device';

import { StudentProfile, Role, StaffProfile } from '../../interfaces';
import { WsApiProvider, SettingsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  role: any;

  feedbackData = {
    name: '',
    studentNumber: '',
    contactNumber: '',
    message: '',
    platform: this.device.platform,
    cordova: this.device.cordova,
    version: this.device.version,
    model: this.device.model,
    manufacturer: this.device.manufacturer,
    isVirtual: this.device.isVirtual
  };

  constructor(
    private emailComposer: EmailComposer,
    private ws: WsApiProvider,
    private device: Device,
    private plt: Platform,
    private settings: SettingsProvider,
  ) { }

  sendEmail() {
    if (this.plt.is('cordova')) {
      if (this.role & Role.Student) {
        let email = {
          to: 'cti@apiit.edu.my',
          subject: "APSpace Feedback",
          body: this.feedbackData.message + "<br><br>"
            + this.feedbackData.name + '<br>'
            + this.feedbackData.studentNumber + '<br>'
            + this.feedbackData.contactNumber + '<br><br>'
            + 'Device Information:' + '<br>'
            + 'Platform: ' + this.feedbackData.platform + '<br>'
            + 'Cordova: ' + this.feedbackData.cordova + '<br>'
            + 'OS Version: ' + this.feedbackData.version + '<br>'
            + 'Model: ' + this.feedbackData.model + '<br>'
            + 'Manufacturer: ' + this.feedbackData.manufacturer + '<br>'
            + 'isVirtual: ' + this.feedbackData.isVirtual,
          isHTML: true
        }
        this.emailComposer.open(email);
      }
      if (this.role & (Role.Lecturer || Role.Admin)) {
        let email = {
          to: 'cti@apiit.edu.my',
          subject: "APSpace Feedback",
          body: this.feedbackData.message + "<br><br>"
            + this.feedbackData.name + '<br>'
            + this.feedbackData.contactNumber + '<br><br>'
            + 'Device Information:' + '<br>'
            + 'Platform: ' + this.feedbackData.platform + '<br>'
            + 'Cordova: ' + this.feedbackData.cordova + '<br>'
            + 'OS Version: ' + this.feedbackData.version + '<br>'
            + 'Model: ' + this.feedbackData.model + '<br>'
            + 'Manufacturer: ' + this.feedbackData.manufacturer + '<br>'
            + 'isVirtual: ' + this.feedbackData.isVirtual,
          isHTML: true
        }
        this.emailComposer.open(email);
      }
    }
  }

  ionViewDidLoad() {
    /* TODO: Add staff name */
    this.role = this.settings.get('role');
    if (this.role & Role.Student) {
      this.ws.get<StudentProfile[]>('/student/profile').subscribe(p => {
        this.feedbackData.name = p[0].NAME;
        this.feedbackData.studentNumber = p[0].STUDENT_NUMBER
      });
    } else if (this.role & (Role.Lecturer || Role.Admin)) {
      this.ws.get<StaffProfile[]>('/staff/profile').subscribe(p => {
        this.feedbackData.name = p[0].FULLNAME;
      })
    }
  }

}
