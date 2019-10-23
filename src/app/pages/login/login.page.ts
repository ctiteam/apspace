import { Component } from '@angular/core';
import { Platform, ToastController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';

import { throwError } from 'rxjs';
import { catchError, switchMap, tap, timeout } from 'rxjs/operators';

import { Role } from '../../interfaces';
import {
  CasTicketService,
  WsApiService,
  SettingsService,
  UserSettingsService,
  NotificationService,
  DataCollectorService
} from '../../services';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { NotificationModalPage } from '../notifications/notification-modal';
// import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  apkey: string;
  password: string;
  showPassword: boolean;

  // LOGIN BUTTON ANIMATIONS ITEMS
  userDidLogin = false;
  loginProcessLoading = false;
  userAuthenticated = false;
  userUnauthenticated = false;

  constructor(
    public alertCtrl: AlertController,
    private cas: CasTicketService,
    private dc: DataCollectorService,
    private fcm: FCM,
    public iab: InAppBrowser,
    private modalCtrl: ModalController,
    private network: Network,
    private notificationService: NotificationService,
    private plt: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private settings: SettingsService,
    private toastCtrl: ToastController,
    private userSettings: UserSettingsService,
    private ws: WsApiService
  ) { }

  login() {
    this.userDidLogin = true;
    this.loginProcessLoading = true;
    if (!this.apkey || !this.password) {
      this.loginProcessLoading = false;
      this.userDidLogin = false;
      this.showToastMessage('Please fill up username and password');
    } else {
      if (this.plt.is('cordova') && this.network.type === 'none') {
        return this.showToastMessage('You are now offline.');
      }
      this.cas.getTGT(this.apkey, this.password).pipe(
        catchError(err => {
          // the error format may changed anytime, should be checked as string
          const errMsg = JSON.stringify(err);

          if (errMsg.includes('AccountPasswordMustChangeException')) {
            this.showConfirmationMessage();
            this.showToastMessage('Your password has expired!');
            return throwError(new Error('Your password has expired!'));
          } else {
            this.showToastMessage('Invalid username or password');
            return throwError(new Error('Invalid Username or Password'));
          }
        }),
        switchMap(tgt => this.cas.getST(this.cas.casUrl, tgt).pipe(
          catchError(() => (this.showToastMessage('Fail to get service ticket.'), throwError(new Error('Fail to get service ticket'))))
        )),
        switchMap(st => this.cas.validate(st).pipe(
          catchError(() => (this.showToastMessage('You are not authorized to use APSpace'), throwError(new Error('unauthorized'))))
        )),
        tap(role => this.cacheApi(role)),
        timeout(15000),
      ).subscribe(
        _ => { },
        _ => {
          this.loginProcessLoading = false;
          this.userUnauthenticated = true;
          setTimeout(() => {
            // Hide the error message after 2 seconds
            this.userUnauthenticated = false;
            this.userDidLogin = false;
          }, 2000);
        },
        () => {
          if (this.plt.is('cordova')) {
            this.runCodeOnReceivingNotification(); // it is called here and in app.component (more details in the app component.ts file)
            this.dc.login().subscribe();
          }
          this.loginProcessLoading = false;
          this.userAuthenticated = true;
          // GET USER ROLE HERE AND CHECK PUSH THE SETTINGS BASED ON THAT
          this.settings.ready().then(() => {
            const role = this.settings.get('role');
            // tslint:disable-next-line:no-bitwise
            if (role & Role.Student) {
              this.userSettings.setDefaultDashboardSections('students');
              // tslint:disable-next-line:no-bitwise
            } else if (role & (Role.Lecturer | Role.Admin)) {
              this.userSettings.setDefaultDashboardSections('staff');
            }
          });
          setTimeout(() => {
            // Show the success message for 300 ms after completing the request
            const url = this.route.snapshot.queryParams.redirect || '/';
            this.router.navigateByUrl(url, { replaceUrl: true });
          }, 300);
        }
      );
    }
  }

  showToastMessage(message: string) {
    this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      animated: true,
      color: 'danger',
      // enterAnimation: toastMessageEnterAnimation,
      // leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }

  // this will fail when the user opens the app for the first time and login because it will run before login
  runCodeOnReceivingNotification() {
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) { // Notification received in background
        this.openNotificationModal(data);
      } else { // Notification received in foreground
        this.presentToastWithOptions(data);
      }
    });
  }

  showConfirmationMessage() {
    this.alertCtrl.create({
      header: 'Your password has expired..',
      message: 'You are required to change your password to be able to login to the APSpace' +
        'and other applications. The following documentation provides the steps to do that.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Open The documentation',
          handler: () => {
            this.iab.create('http://kb.sites.apiit.edu.my/question/apkey-troubleshooting/', '_system', 'location=true');
          }
        }
      ]
    }).then(confirm => confirm.present());
  }

  async openNotificationModal(message: any) {
    // need to check with dingdong team about response type
    const modal = await this.modalCtrl.create({
      component: NotificationModalPage,
      componentProps: { message, notFound: 'No Message Selected' },
    });
    this.notificationService.sendRead(message.message_id).subscribe();
    await modal.present();
    await modal.onDidDismiss();
  }

  async presentToastWithOptions(data: any) {
    // need to check with dingdong team about response type
    const toast = await this.toastCtrl.create({
      header: 'New Message',
      message: data.title,
      position: 'top',
      color: 'primary',
      buttons: [
        {
          icon: 'open',
          handler: () => {
            this.openNotificationModal(data);
          }
        }, {
          icon: 'close',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    toast.present();
  }

  cacheApi(role: Role) {
    // tslint:disable-next-line:no-bitwise
    const caches = role & Role.Student
      ? ['/student/profile', '/student/courses', '/staff/listing']
      : ['/staff/profile', '/staff/listing'];
    caches.forEach(endpoint => this.ws.get(endpoint, true).subscribe());
  }

}
