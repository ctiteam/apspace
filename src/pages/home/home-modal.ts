import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-home-modal',
  templateUrl: 'home-modal.html',
})
export class HomeModalPage {
  itemDetails: any = []
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {

    this.itemDetails = this.navParams.get("itemDetail")
    this.itemDetails = this.itemDetails
  }
}
