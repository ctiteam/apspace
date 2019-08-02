import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { WsApiService } from 'src/app/services';
import { Classcode } from '../../../interfaces';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss']
})
export class ClassesPage implements OnInit {

  classcode$: Observable<string[]>;

  selClasscode: string;
  selDatetime: string;

  constructor(private ws: WsApiService, public navCtrl: NavController) { }

  ngOnInit() {
    this.classcode$ = this.ws.get<Classcode[]>('/student/classcodes').pipe(
      pluck('CLASS_CODE')
      // TODO: guess work
    );
  }

  markAttendance() {
    console.log(this.selClasscode, this.selDatetime);
  }

  openPage(page: string) {
    this.navCtrl.navigateForward(page);
  }

}
