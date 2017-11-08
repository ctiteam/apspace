import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-f-ees',
  templateUrl: 'f-ees.html'
})
export class FEESPage {

  fee: string = "summary";

  constructor(public navCtrl: NavController) {
  }
  
}
