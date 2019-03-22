import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WsApiProvider } from '../../providers';
import { Observable } from 'rxjs';
import { Qualification } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-qualification-verification',
  templateUrl: 'qualification-verification.html',
})
export class QualificationVerificationPage {
  graduater$: Observable<Qualification[]>;
  searchKeyword = '';
  userSearched = false;
  resultKeyWord = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private ws: WsApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QualificationVerificationPage');
  }

  searchForGraduaters(){
    console.log('hioi');
    this.userSearched = true;
    this.resultKeyWord = this.searchKeyword;
    this.graduater$ = this.ws.get<Qualification[]>(`/alumni/validate?criterion=${this.searchKeyword}`, true, {auth: false});
  }

}
