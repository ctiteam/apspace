import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  feedbackData = {
    "name": "", "studentNumber": "",
    "contactNumber": "", "message": ""
  };

  constructor(private emailComposer: EmailComposer) { }


  sendEmail() {
    let email = {
      to: 'cti@apiit.edu.my',
      subject: "iWebspace Feedback",
      body: this.feedbackData.message + "<br><br>"
        + this.feedbackData.name + '<br>' + this.feedbackData.studentNumber
        + '<br>' + this.feedbackData.contactNumber,
      isHTML: true
    };
    this.emailComposer.open(email);
  }

}
