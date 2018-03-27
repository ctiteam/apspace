import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {
  feedback: string = "submit"
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, private emailComposer: EmailComposer) {
  }

  feedbackData = { "name": "", "studentNumber": "", "contactNumber": "", "message": "" };

  url: string = "https://www.facebook.com/apuniversity/?ref=br_rs";
  twitUrl: string = "https://twitter.com/AsiaPacificU";
  googleUrl: string = "https://plus.google.com/+AsiaPacificUniversityKualaLumpur";
  linkedinUrl: string = "https://www.linkedin.com/school/989991/";


  validateField() {
    if (!this.feedbackData.name || !this.feedbackData.contactNumber || !this.feedbackData.message) {
      this.presentAlert();
    } else {
      this.sendEmail();
    }
  }

  //Alerts the user to fill up all the empty field before sending the Feedback
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Denied',
      subTitle: 'Please, fill up first',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  sendEmail() {
    let email = {
      to: 'cti@apiit.edu.my',
      subject: "Mobile iWebspace Feedback",
      body: this.feedbackData.message + "<br><br>" + this.feedbackData.name + '<br>' + this.feedbackData.studentNumber + '<br>' + this.feedbackData.contactNumber,
      isHTML: true
    };
    this.emailComposer.open(email);
  }

  openFacebook(url: string) {

  }
  openTwitter(twitUrl: string) {

  }
  openGooglePlus(googleUrl: string) {

  }

  openLinkedIn(linkedinUrl: string) {

  }
}
