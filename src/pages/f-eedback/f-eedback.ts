import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-f-eedback',
  templateUrl: 'f-eedback.html'
})
export class FEEDBACKPage {
  feedback: string = "submit"
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, private emailComposer: EmailComposer, private inAppBrowser: InAppBrowser) {
  }

  feedbackData = { "name": "", "contactNumber": "", "message": "" };

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
      to: 'stefunic@mail.ru',
      subject: "Mobile iWebspace Feedback",
      body: this.feedbackData.name + '\n' + this.feedbackData.contactNumber + '\n' + this.feedbackData.message,
      isHTML: true
    };
    this.emailComposer.open(email);
  }

  openFacebook(url: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(url, '_self', options)
  }
  openTwitter(twitUrl: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(twitUrl, '_self', options)
  }
  openGooglePlus(googleUrl: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(googleUrl, '_self', options)
  }

  openLinkedIn(linkedinUrl: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(linkedinUrl, '_self', options)
  }

}
