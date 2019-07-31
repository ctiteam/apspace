import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services';
import { map, tap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  cordova: boolean;
  messages$: Observable<any>;

  constructor(
    private platform: Platform,
    private notificationService: NotificationService,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.cordova = true;
    }
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.messages$ = this.notificationService.getMessages().pipe(
      map((res: {history: []}) => res.history),
      tap(t => console.log(t)),
    );
  }

}
