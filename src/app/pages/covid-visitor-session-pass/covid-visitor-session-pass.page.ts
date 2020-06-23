import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-covid-visitor-session-pass',
  templateUrl: './covid-visitor-session-pass.page.html',
  styleUrls: ['./covid-visitor-session-pass.page.scss'],
})
export class CovidVisitorSessionPassPage implements OnInit {
  timer$ = timer(0, 1000);
  timerSubscription$: Subscription;
  counter: Date;
  sessionExpired = false;
  decLog$: Observable<any>;
  constructor(
    private router: Router,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.decLog$ = this.ws.get('/covid/declaration_log').pipe(
      tap(res => {
        if (res && res.is_valid) {
          const validUntil = new Date(res.valid_time);
          const currentDate = new Date();
          this.startTimer(moment(validUntil).diff(moment(currentDate), 'seconds'));
        } else {
          this.router.navigateByUrl('/');
        }
      })
    );
  }

  startTimer(counterValueInSeconds: number) {
    const counterValue = moment('2015-01-01').startOf('day')
      .seconds(counterValueInSeconds);
    this.timerSubscription$ = this.timer$.subscribe(t => {
      this.counter = counterValue.toDate();
      this.counter.setSeconds(this.counter.getSeconds() - t);
      if (this.counter.getHours() === 0 && this.counter.getMinutes() === 0 && this.counter.getSeconds() === 0) {
        console.log('toto');
        // this.showButtons = true;
        this.sessionExpired = true;
        this.timerSubscription$.unsubscribe();
      }
    });
  }

}
