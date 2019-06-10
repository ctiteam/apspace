import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events, Platform, ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

import { EMPTY, Subscription, throwError } from 'rxjs';
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

  onLoginBtnClicked() {
    this.userDidLogin = true;
    this.loginProcessLoading = true;
    if (!this.apkey || !this.password) {
      this.loginProcessLoading = false;
      this.userDidLogin = false;
      this.toast("Please, fill up username and password");
    } else{
      if (this.plt.is('cordova') && this.network.type === 'none') {
        return this.toast('You are now offline.');
      }
      this.cas.getTGT(this.apkey, this.password).pipe(
        catchError(e => (this.toast('Invalid Username or Password'), throwError('Invalid Username or Password'))),
        switchMap(tgt => this.cas.getST(this.cas.casUrl, tgt).pipe(
          catchError(e => (this.toast('Fail to get service ticket.'), throwError('Fail to get service ticket')))
        )),
        switchMap(st => this.cas.validate(st).pipe(
          catchError(e => (this.toast('You are not authorized to use APSpace'), throwError('unauthorized')))
        )),
        tap(role => this.cacheApi(role)),
        timeout(15000),
        tap(_ => this.events.publish('user:login')),
      ).subscribe(
        _ => {},
        _ => {
          this.loginProcessLoading = false;
          this.userUnauthenticated = true;
          setTimeout(() => {
            // Hide the error message after 700 ms
            this.userUnauthenticated = false;
            this.userDidLogin = false;
          }, 900);
        },
        () => {
          this.loginProcessLoading = false;
          this.userAuthenticated = true;
          setTimeout(() => {
            // Show the success message for 700 ms after completing the request
            this.router.navigate(['/student-timetable']);
          }, 900);
        }
      );
    }
  }

  cacheApi(role: Role) {
    // tslint:disable-next-line:no-bitwise
    const caches = role & Role.Student
      ? ['/student/profile', '/student/courses', '/staff/listing']
      : ['/staff/profile', '/staff/listing'];
    caches.forEach(endpoint => this.ws.get(endpoint, true).subscribe());
  }

}
