import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'

@Component({
  selector: 'page-f-eedback',
  templateUrl: 'f-eedback.html'
})
export class FEEDBACKPage {
  feedback: string = "submit"
  constructor(public navCtrl: NavController, private emailComposer: EmailComposer, private inAppBrowser: InAppBrowser) {
  }

  url: string ="https://www.facebook.com/apuniversity/?ref=br_rs";
  twitUrl: string ="https://twitter.com/AsiaPacificU";
  googleUrl: string ="https://plus.google.com/+AsiaPacificUniversityKualaLumpur";
  linkedinUrl: string ="https://www.linkedin.com/school/989991/";
  


  sendEmail(){
    let email = {
      to: 'stefunic@mail.ru',
      subject: 'Feedback/Enquiries',
      body: 'Esen Zheenchoroev - TP034790',
      isHTML: true
    };
    this.emailComposer.open(email);
  }

  openFacebook(url : string){
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(url, '_self', options)
  }
  openTwitter(twitUrl : string){
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(twitUrl, '_self', options)
  }
  openGooglePlus(googleUrl : string){
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(googleUrl, '_self', options)
  }

  openLinkedIn(linkedinUrl : string){
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(linkedinUrl, '_self', options)
  }
  
}
