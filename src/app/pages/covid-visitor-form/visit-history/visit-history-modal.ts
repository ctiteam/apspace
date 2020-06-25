import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WsApiService } from 'src/app/services';
@Component({
  selector: 'page-visit-history-modal',
  templateUrl: 'visit-history-modal.html',
  styleUrls: ['visit-history-modal.scss']
})

export class VisitHistoryModalPage implements OnInit {
  show: 'history' | 'symptoms';
  declarationId: number | any;
  roomsList$: Observable<any>;
  skeletons = new Array(7);
  constructor(
    private modalCtrl: ModalController,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.roomsList$ = this.ws.get(`/covid/room_attendance_log?declaration_id=${this.declarationId}`).pipe(
      tap(res => console.log(res))
    );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
