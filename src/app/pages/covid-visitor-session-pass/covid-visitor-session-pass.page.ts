import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

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
  constructor() { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timerSubscription$ = this.timer$.subscribe(t => {
      this.counter = new Date(0, 0, 0, 11, 59, 59);
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
