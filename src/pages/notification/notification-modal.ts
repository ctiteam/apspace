import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-notification-modal',
  templateUrl: 'notification-modal.html',
})
export class NotificationModalPage {

  itemDetails: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {}

  ionViewDidLoad(){
    this.itemDetails = this.navParams.get('itemDetails');
  }
}
