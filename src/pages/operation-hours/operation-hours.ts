import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

import { OperationHours } from '../../interfaces';
import { OperationHoursProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-operation-hours',
  templateUrl: 'operation-hours.html',
  animations: [
    trigger('easeIn', [
      transition('void => *', [
        style({ opacity: '.8', height: '0' }),
        animate('250ms ease-in', style({ opacity: '1', height: '*' })),
      ]),
    ]),
    trigger('easeOut', [
      transition('* => void', [
        style({ opacity: '1', height: '*' }),
        animate('150ms ease-out', style({ opacity: '.7', height: '0', paddingBottom: '0' })),
      ]),
    ]),
  ],
})
export class OperationHoursPage {

  hours$: Observable<OperationHours[]>;
  selectedService: string;

  services = [
    { name: 'Immigration', id: 'immigration', icon: 'globe', fg: '#66d174' },
    { name: 'Student Service', id: 'studentservices', icon: 'bookmarks', fg: '#dd803e' },
    { name: 'Admin', id: 'admin', icon: 'list-box', fg: '#626b70' },
    { name: 'Accommodation', id: 'accommodation', icon: 'home', fg: '#2392ce' },
    { name: 'Library', id: 'library', icon: 'book', fg: '#26205e' },
    { name: 'Cashier', id: 'cashier', icon: 'cash', fg: '#ccbf37' },
    { name: 'Labs', id: 'labs', icon: 'desktop', fg: '#33688e' },
    { name: 'Clinic', id: 'clinic', icon: 'medkit', fg: '#f23239' },
    { name: 'Printshop @ APU', id: 'printshop', icon: 'print', fg: '#f23239' },
  ];

  constructor(
    private operationHours: OperationHoursProvider,
    private sanitizer: DomSanitizer,
  ) { }

  get(id: string, refresher?) {
    // deselect on second tap (ignore refresh)
    if (refresher || id !== this.selectedService) {
      // complete refresh on null id
      if (id) {
        this.selectedService = id;
        this.hours$ = this.operationHours.get(id, Boolean(refresher)).pipe(
          finalize(() => refresher && refresher.complete()),
        );
      } else {
        refresher.complete();
      }
    } else {
      this.selectedService = null;
    }
  }

  sanitize(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  ionViewDidLoad() {
    // this.get('immigration');
  }

}
