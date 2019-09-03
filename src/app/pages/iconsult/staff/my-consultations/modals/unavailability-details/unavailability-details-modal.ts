import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { WsApiService } from 'src/app/services';
import { UnavailabilityDetails } from 'src/app/interfaces';

@Component({
  selector: 'page-unavailability-details-modal',
  templateUrl: 'unavailability-details-modal.html',
  styleUrls: ['unavailability-details-modal.scss']
})

export class UnavailabilityDetailsModalPage implements OnInit {
  unavailibilityid;
  slotDetails$: Observable<UnavailabilityDetails[]>;

  constructor(private modalCtrl: ModalController, private ws: WsApiService) { }

  ngOnInit() {
    this.slotDetails$ = this.ws.get<UnavailabilityDetails[]>(`/iconsult/get_unavailrule_details/${this.unavailibilityid}`, true).pipe(
      tap(r => console.log(r))
    );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
