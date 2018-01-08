import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { TimetableProvider } from '../../providers/timetable/timetable';

@IonicPage()
@Component({
  selector: 'page-timetable-conf',
  templateUrl: 'timetable-conf.html',
})
export class TimetableConfPage {

  intake: string;
  intakes: string[];

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public ttService: TimetableProvider
  ) {
    this.intake = params.get('intake');
    ttService.getTimetable().subscribe(tt =>
      this.intakes = Array.from(new Set(tt.map(t => t.INTAKE)))
    );
  }

  dismiss() {
    this.viewCtrl.dismiss({ intake: this.intake });
  }

}
