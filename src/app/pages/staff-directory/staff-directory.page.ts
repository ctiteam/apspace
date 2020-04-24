import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

import * as Fuse from 'fuse.js';

import { StaffDirectory } from '../../interfaces';
import { WsApiService } from '../../services';

@Component({
  selector: 'app-staff-directory',
  templateUrl: './staff-directory.page.html',
  styleUrls: ['./staff-directory.page.scss'],
})
export class StaffDirectoryPage {

  term = '';
  dept = '';
  staff$: Observable<StaffDirectory[]>;
  staffType$: Observable<string[]>;
  skeletons = new Array(6);
  options: Fuse.FuseOptions<StaffDirectory> = {
    keys: [
      {name: 'FULLNAME', weight: 0.2},
      {name: 'CODE', weight: 0.1},
      {name: 'ID', weight: 0.1},
      {name: 'EMAIL', weight: 0.1},
      {name: 'EXTENSION', weight: 0.1},
      {name: 'TITLE', weight: 0.1},
    ]
  };

  constructor(private ws: WsApiService) { }

  ionViewDidEnter() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing', { caching });
    this.staffType$ = this.staff$.pipe(
      filter(ss => ss instanceof Array),
      map(ss => Array.from(new Set(ss.map(s => s.DEPARTMENT))).sort()),
      finalize(() => refresher && refresher.target.complete()),
    );
  }

  trackById(value: StaffDirectory): string {
    return value.CODE;
  }

}
