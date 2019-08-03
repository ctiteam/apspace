import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

import { StaffDirectory } from '../../interfaces';
import { WsApiService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-directory',
  templateUrl: './staff-directory.page.html',
  styleUrls: ['./staff-directory.page.scss'],
})
export class StaffDirectoryPage implements OnInit {

  term = '';
  dept = '';
  staff$: Observable<StaffDirectory[]>;
  staffType$: Observable<string[]>;

  constructor(
    private ws: WsApiService,
    private router: Router
  ) { }

  // @HostListener('keydown', ['$event'])
  // onkeydown(ev) {
  //   if (ev.keyCode === 13) {
  //     const activeElement = document.activeElement as HTMLElement;
  //     activeElement && activeElement.blur && activeElement.blur();
  //   }
  // }

  ngOnInit() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing', Boolean(refresher));
    this.staffType$ = this.staff$.pipe(
      filter(ss => ss instanceof Array),
      map(ss => Array.from(new Set(ss.map(s => s.DEPARTMENT))).sort()),
      finalize(() => refresher && refresher.complete()),
    );
  }

  openInfo(id = null) {
    if (id == null) {
      return; // Shouldn't happen, but just incase.
    }

    this.router.navigate(['/staff', id]);
  }

}
