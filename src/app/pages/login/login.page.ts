import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, IonContent, IonSlides, Platform, ToastController } from '@ionic/angular';

import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, timeout } from 'rxjs/operators';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Role, ShortNews } from '../../interfaces';

import {
  CasTicketService,
  DataCollectorService,
  NewsService,
  SettingsService,
  UserSettingsService,
  WsApiService
} from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  activeSection = 1;
  screenHeight: number;
  screenWidth: number;

  @ViewChild('content', { static: true }) content: IonContent;
  @ViewChild('sliderSlides') sliderSlides: IonSlides;

  noticeBoardItems$: Observable<any[]>;
  news$: Observable<ShortNews[]>;


  sections = [
    { name: 'main', y: 0 },
    { name: 'announcement', y: 1 },
    { name: 'news', y: 2 },
    {name: 'operationHours', y: 3},
    // {name: 'mediaLinks', y: 4}
  ];

  test = new Array(4);
  slideOpts = {
    initialSlide: 1,
    autoplay: true,
    speed: 400,
    loop: true,
    autoplayDisableOnInteraction: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (_, className) => {
        return '<span style="width: 10px; height: 10px; background-color: #753a88 !important;" class="' + className + '"></span>';
      }
    }
  };


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
    public iab: InAppBrowser,
    private network: Network,
    public plt: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private settings: SettingsService,
    private toastCtrl: ToastController,
    private userSettings: UserSettingsService,
    private ws: WsApiService,
    private news: NewsService
  ) {
    this.getScreenSize();
  }

  ngOnInit() {
    const rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/;
    this.moveToSection(0);
    this.noticeBoardItems$ = this.news.getSlideshow().pipe(
      map((noticeBoardItems: any) => {
        return noticeBoardItems.map(item => {
          if (item && item.field_image_link.length > 0 && item.field_image_link[0].value) {
            return {
              value: rex.exec(item.field_image_link[0].value)[1],
              title: item.title.length > 0 && item.title[0].value ? item.title[0].value : '',
              updated: item.changed.length > 0 && item.changed[0].value ? new Date(item.changed[0].value * 1000) : ''
            };
          }
        });
      }),
    );
    this.news$ = this.news.get().pipe(
      map(newsList => {
        return newsList.map(item => {
          if (item && item.field_news_image.length > 0 && item.field_news_image[0].url) {
            return {
              url: item.field_news_image[0].url,
              title: item.title.length > 0 && item.title[0].value ? item.title[0].value : '',
              updated: item.changed.length > 0 && item.changed[0].value ? new Date(item.changed[0].value * 1000) : '',
              body: item.body.length > 0 && item.body[0].value ? item.body[0].value : ''
            };
          }
        }).slice(0, 6);
      }),
      tap(res => console.log(res))
    );
  }

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
    }).then(toast => toast.present());
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
            this.openApkeyTroubleshooting();
          }
        }
      ]
    }).then(confirm => confirm.present());
  }

  cacheApi(role: Role) {
    // tslint:disable-next-line:no-bitwise
    const caches = role & Role.Student
      ? ['/student/profile', '/student/courses', '/staff/listing']
      : ['/staff/profile', '/staff/listing'];
    caches.forEach(endpoint => this.ws.get(endpoint).subscribe());
  }

  openApkeyTroubleshooting() {
    this.iab.create('http://kb.sites.apiit.edu.my/knowledge-base/unable-to-sign-in-using-apkey-apkey-troubleshooting/', '_system', 'location=true');
  }

  logScrolling(ev) {
    if (ev.detail.startY !== ev.detail.currentY) {
      if (ev.detail.startY < ev.detail.currentY) {
        console.log('scrolling down');
        if (ev.detail.currentY >= (this.activeSection + 1) * this.screenHeight) {
          console.log('time to switch active');
          this.activeSection++;
        }
      } else {
        console.log('scrolling up');
        if (this.activeSection !== 0) { // only if the active is not the first section
          if (ev.detail.currentY <= (this.activeSection - 1) * this.screenHeight) {
            console.log('time to switch active');
            this.activeSection--;
          }
        }
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  moveToNextPage() {
    this.content.scrollByPoint(0, this.screenHeight, 900);
  }

  moveToSection(sectionNumber: number) {
    if (sectionNumber === 0) { // fast scroll to top
      this.content.scrollToTop(900);
    } else if (this.activeSection <= sectionNumber) {
      this.content.scrollByPoint(0, sectionNumber * this.screenHeight, 900);
    }
    else {
      this.content.scrollByPoint(0, (sectionNumber - this.activeSection) * this.screenHeight, 900);
    }
    this.activeSection = sectionNumber;
  }

  // SLIDER
  prevSlide() {
    this.sliderSlides.slidePrev();
  }

  nextSlide() {
    this.sliderSlides.slideNext();
  }

}
