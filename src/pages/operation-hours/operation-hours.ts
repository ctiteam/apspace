import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

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
    trigger('easeInOut', [
      transition('void => *', [
        style({ opacity: '.8', height: '0' }),
        animate('250ms ease-in', style({ opacity: '1', height: '*' })),
      ]),
      transition('* => void', [
        style({ opacity: '1', height: '*' }),
        animate('150ms ease-out', style({ opacity: '.7', height: '0', paddingBottom: '0' })),
      ]),
    ]),
  ],
})
export class OperationHoursPage {

  selectedService = 'Immigration';

  expand(service: string) {
    this.selectedService = this.selectedService !== service ? service : null;
  }

}
