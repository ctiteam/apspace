import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { IonicPage } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
      transition(':enter', [
        style({ opacity: '.8', height: '0' }),
        animate('250ms ease-in', style({ opacity: '1', height: '*' })),
      ]),
    ]),
    trigger('easeOut', [
      transition(':leave', [
        style({ opacity: '1', height: '*' }),
        animate('150ms ease-out', style({ opacity: '.7', height: '0', paddingBottom: '0' })),
      ]),
    ])
  ]
})
export class OperationHoursPage {

  hours$: Observable<OperationHours[]>;
  selectedService: string;

  services = [
    { name: 'Immigration', id: 'immigration', icon: 'globe' },
    { name: 'Student Service', id: 'studentservices', icon: 'bookmarks' },
    { name: 'Admin', id: 'admin', icon: 'list-box' },
    { name: 'Accomodation', id: 'accomodation', icon: 'home' },
    { name: 'Library', id: 'library', icon: 'book' },
    { name: 'Cashier', id: 'cashier', icon: 'cash' },
    { name: 'Labs', id: 'labs', icon: 'desktop' },
    { name: 'Clinic', id: 'clinic', icon: 'medkit' },
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
