import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { StaffDirectory } from '../interfaces';
import { WsApiService } from '../services';

/**
 * Display staff information. Can also be used as model.
 */
@Component({
  selector: 'app-staff-directory-info',
  templateUrl: './staff-directory-info.page.html',
  styleUrls: ['./staff-directory-info.page.scss'],
})
export class StaffDirectoryInfoPage implements OnInit {

  staff$: Observable<StaffDirectory>;

  constructor(private route: ActivatedRoute, private ws: WsApiService) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing').pipe(
      map(ss => ss.find(s => s.ID === id)),
      share(),
    );
  }

}
