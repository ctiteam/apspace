import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WsApiService } from 'src/app/services';
import { SlotDetails } from 'src/app/interfaces';

@Component({
  selector: 'page-lecturer-slot-details-modal',
  templateUrl: 'lecturer-slot-details-modal.html',
  styleUrls: ['lecturer-slot-details-modal.scss']
})
// This page has not been migrated yet. It is added to fix the pipeline error
export class LecturerSlotDetailsModalPage implements OnInit {
  // slotId;
  // slotDetails$: Observable<SlotDetails>;

  constructor(private modalCtrl: ModalController, private ws: WsApiService) { }

  ngOnInit() {
    // this.slotDetails$ = this.ws.get<SlotDetails>(`/iconsult/detailpageconstu/${this.slotId}`, true).pipe(
    //   map(response => response[0]),
    // );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
