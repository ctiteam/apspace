import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { publishLast, refCount, tap } from 'rxjs/operators';

import { Router } from '@angular/router';
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
  showAttendixFeature = false;
  staffProfiles$: Observable<StaffProfile[]>;

  constructor(private ws: WsApiService, private router: Router) { }

  ngOnInit() {
    this.staffProfiles$ = this.ws.get<StaffProfile[]>('/staff/profile', { caching: 'cache-only' }).pipe(
      tap(profile => {
        this.showAttendixFeature = chosenOnes.includes(profile[0].ID);
      }),
      publishLast(),
      refCount(),
    );
  }

  comingFromTabs() {
    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;
  }

}
