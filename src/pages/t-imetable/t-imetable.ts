import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TimetableProvider} from '../../providers/timetable/timetable';

@Component({
  selector: 'page-t-imetable',
  templateUrl: 't-imetable.html',
})
export class TIMETABLEPage {

  timetables: any = [];

  constructor(public navCtrl: NavController, private storage: Storage, public http: Http, public timetableProvider: TimetableProvider ) {
    
    this.timetables = this.timetableProvider.getTimetable();
    console.log(this.timetables);
    


    this.getvalue();
  }

  test: any;

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  getvalue() {
    this.storage.get('ticket').then((val) => {
      this.test  = val;
     console.log("GET VALUE   :"+ this.test)
    });
  }

  





 }
