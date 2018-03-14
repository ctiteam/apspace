import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-fees',
  templateUrl: 'fees.html'
})
export class FeesPage {

  fee: string = "summary";

  constructor(public navCtrl: NavController) {
  }
  
}
