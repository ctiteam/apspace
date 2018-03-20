import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';




@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {


  url: string = "https://www.facebook.com/apuniversity/?ref=br_rs";
  twitUrl: string = "https://twitter.com/AsiaPacificU";
  googleUrl: string = "https://plus.google.com/+AsiaPacificUniversityKualaLumpur";
  linkedinUrl: string = "https://www.linkedin.com/school/989991/";

  feedbackData = {
    "name": "", "studentNumber": "",
    "contactNumber": "", "message": ""
  };

  constructor(
    private emailComposer: EmailComposer,
    private inAppBrowser: InAppBrowser) { }


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

  openFacebook(url) {
    this.inAppBrowser.create(url)
  }
  openTwitter(twitUrl) {
    this.inAppBrowser.create(twitUrl)
  }
  openGooglePlus(googleUrl) {
    this.inAppBrowser.create(googleUrl)
  }
  openLinkedIn(linkedinUrl) {
    this.inAppBrowser.create(linkedinUrl)
  }
}
