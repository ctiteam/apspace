import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishLast, refCount } from 'rxjs/operators';

import { StaffProfile } from '../../interfaces';
import { WsApiService } from '../../services';

const chosenOnes = ['appsteststaff1', 'abbhirami', 'abubakar_s',
  'haslina.hashim', 'muhammad.danish', 'sireesha.prathi', 'suresh.saminathan'];

@Component({
  selector: 'app-lecturer-timetable',
  templateUrl: './lecturer-timetable.page.html',
  styleUrls: ['./lecturer-timetable.page.scss'],
})
export class LecturerTimetablePage implements OnInit {

  staffProfiles$: Observable<StaffProfile[]>;

  constructor(private ws: WsApiService) { }

  ngOnInit() {
    this.staffProfiles$ = this.ws.get<StaffProfile[]>('/staff/profile').pipe(
      publishLast(),
      refCount(),
    );
  }

  get attendixFeature() {
    return this.staffProfiles$.pipe(
      map(profile => chosenOnes.includes(profile[0].ID)),
    );
  }

}
