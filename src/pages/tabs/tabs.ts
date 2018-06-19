import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  seeTabs: boolean = true;

  root1="HomePage";
  root2="TimetablePage";
  root3="AttendancePage";
  root4="ApcardPage";
  root5="MorePage";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {}

}
