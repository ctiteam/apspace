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
    keys: ['FULLNAME', 'CODE', 'ID', 'EMAIL', 'EXTENSION', 'TITLE']
  };

  constructor(private ws: WsApiService) { }

  ionViewDidEnter() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing', Boolean(refresher));
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
