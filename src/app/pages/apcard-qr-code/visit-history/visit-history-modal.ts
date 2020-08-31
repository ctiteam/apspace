import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { WsApiService } from 'src/app/services';
@Component({
  selector: 'page-visit-history-modal',
  templateUrl: 'visit-history-modal.html',
  styleUrls: ['visit-history-modal.scss']
})

export class VisitHistoryModalPage implements OnInit {
  roomsList$: Observable<any>;
  skeletons = new Array(7);
  constructor(
    private modalCtrl: ModalController,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.roomsList$ = this.ws.get('/qr_code/attendee');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
