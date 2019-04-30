import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WsApiProvider } from '../../providers';
import { Observable } from 'rxjs';
import { Qualification } from '../../interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-qualification-verification',
  templateUrl: 'qualification-verification.html',
})
export class QualificationVerificationPage {
  graduater$: Observable<Qualification[]>;
  searchKeyword;
  userSearched = false;
  resultKeyWord;
  formsURL = 'http://forms.sites.apiit.edu.my/certificate-email-form/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ws: WsApiProvider,
    private iab: InAppBrowser    
    ) {
  }

  ionViewDidLoad() {

  }

  searchForGraduaters(){
    this.userSearched = true;
    this.resultKeyWord = this.searchKeyword || '';
    this.graduater$ = this.ws.get<Qualification[]>(`/alumni/validate?criterion=${this.searchKeyword}`, true, {auth: false});
  }

  openForms(){
    this.iab.create(`${this.formsURL}`, '_blank', 'location=true');
  }

}
