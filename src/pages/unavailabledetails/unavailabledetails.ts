import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { UpcomingConLecProvider } from '../../providers/upcoming-con-lec';
import { UpcominglecPage } from '../iConsult-lecturer/upcominglec';

@IonicPage()
@Component({
  selector: 'page-unavailabledetails',
  templateUrl: 'unavailabledetails.html',
})
export class UnavailabledetailsPage {

  unavailibilityid = this.navParams.get('unavailibilityid');
  unavailibilityId2 = this.navParams.get('unavailibilityid');
  unfreeslots$: Observable<any[]>;
  starttimes$: Observable<any[]>;

  currentDateTime: string = moment().format();
  ruleStatus: number = 0;

  disableunavailslots = {
    rule_status: this.ruleStatus,
    delete_time: this.currentDateTime,

  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private UpcomingConLec: UpcomingConLecProvider) {
  }

  ionViewDidLoad() {
    this.unfreeslots$ = this.UpcomingConLec.getUnavailrulesdetails(this.unavailibilityid);
    this.starttimes$ = this.UpcomingConLec.getallstarttimes(this.unavailibilityId2);
  }

  disable() {
    this.UpcomingConLec.disableunailrules(this.unavailibilityid, this.disableunavailslots).subscribe(freeslots => {
        this.navCtrl.setRoot(UpcominglecPage);
      },
    );
  }

}
