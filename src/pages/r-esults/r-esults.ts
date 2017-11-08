import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ResultProvider} from '../../providers/result/result-data';

@Component({
  selector: 'page-r-esults',
  templateUrl: 'r-esults.html',
  providers: [ResultProvider]
})
export class RESULTSPage {
  seg: string = "lev2"
  resultList = [];
  resultList2  = [];

  constructor(public navCtrl: NavController, private resultProvider: ResultProvider) {
    this.getResultData();
    this.getResultData2();
  }
  getResultData(){
    this.resultProvider.getResultData().subscribe(data => this.resultList = data);
  }

  getResultData2(){
    this.resultProvider.getResultData2().subscribe(data => this.resultList2 = data);
  }
}
