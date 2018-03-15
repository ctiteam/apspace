import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-fees',
  templateUrl: 'fees.html'
})
export class FeesPage {

  fee: string = "summary";

  constructor(public navCtrl: NavController) {
  }
  
}
