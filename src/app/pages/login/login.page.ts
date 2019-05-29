import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events, Platform, ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

import { EMPTY, Subscription } from 'rxjs';
import { catchError, switchMap, tap, timeout } from 'rxjs/operators';

import { Role } from '../../interfaces';
import { CasTicketService, WsApiService, SettingsService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  apkey: string;
  password: string;
  showPassword: boolean;

  // LOGIN BUTTON ANIMATIONS ITEMS
  userDidLogin = false;
  loginProcessLoading = false;
  userAuthenticated = false;
  userUnauthenticated = false;

  constructor(
    private cas: CasTicketService,
    private events: Events,
    private network: Network,
    private plt: Platform,
    private router: Router,
    private settings: SettingsService,
    private toastCtrl: ToastController,
    private ws: WsApiService,
  ) { }

  ngOnInit() {
  }

  toast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    }).then(toast => toast.present());
  }

  onLoginClicked() {
    if (this.plt.is('cordova') && this.network.type === 'none') {
      return this.toast('You are now offline.');
    }
    this.userDidLogin = true;
    this.loginProcessLoading = true;
    this.cas.getTGT(this.apkey, this.password).pipe(
      catchError(e => (this.toast(e), EMPTY)),
      switchMap(tgt => this.cas.getST(this.cas.casUrl, tgt)),
      catchError(_ => (this.toast('Fail to get service ticket.'), EMPTY)),
      switchMap(st => this.cas.validate(st)),
      catchError(_ => (this.toast('You are not authorized to use APSpace'), EMPTY)),
      tap(role => this.cacheApi(role)),
      timeout(15000),
      tap(_ => this.events.publish('user:login')),
    ).subscribe(
      _ => { },
      _ => {
        this.loginProcessLoading = false;
        this.userUnauthenticated = true;
      },
      () => {
        this.loginProcessLoading = false;
        this.userAuthenticated = true;
        setTimeout(() => {
          // Show the success message for 700 ms after completing the request
          this.router.navigate(['/']);
        }, 700);
      }
    );
  }

  cacheApi(role: Role) {
    // tslint:disable-next-line:no-bitwise
    const caches = role & Role.Student
      ? ['/student/profile', '/student/courses', '/staff/listing']
      : ['/staff/profile', '/staff/listing'];
    caches.forEach(endpoint => this.ws.get(endpoint, true).subscribe());
  }

}
