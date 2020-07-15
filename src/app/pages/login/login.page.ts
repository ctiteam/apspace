import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, IonSlides, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, timeout } from 'rxjs/operators';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { QuixCustomer, Role, ShortNews } from '../../interfaces';

import {
  CasTicketService, DataCollectorService, NewsService, SettingsService,
  WsApiService
} from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  activeSection = 0;
  screenHeight: number;
  screenWidth: number;

  @ViewChild('sliderSlides') sliderSlides: IonSlides;

  noticeBoardItems$: Observable<any[]>;
  news$: Observable<ShortNews[]>;
  quixCompanies$: Observable<any[]>;
  selectedQuixSegment: 'APU' | 'APIIT' = 'APU';


  currentYear = new Date().getFullYear();
  test = new Array(4);

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
    centeredContent: true,
    speed: 400,
    loop: true,
    autoplayDisableOnInteraction: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (_, className) => {
        return '<span style="width: 10px; height: 10px; background-color: #14557b !important;" class="' + className + '"></span>';
      }
    }
  };

  operationHoursSlider = {
    slidesPerView: 'auto',
    initialSlide: 1,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    on: {
      beforeInit() {
        const swiper = this;

        swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const { width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

          let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
          // var rotateZ = 0
          let translateZ = -translate * Math.abs(offsetMultiplier);

          let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
          let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

          // Fix for ultra small values
          if (Math.abs(translateX) < 0.001) { translateX = 0; }
          if (Math.abs(translateY) < 0.001) { translateY = 0; }
          if (Math.abs(translateZ) < 0.001) { translateZ = 0; }
          if (Math.abs(rotateY) < 0.001) { rotateY = 0; }
          if (Math.abs(rotateX) < 0.001) { rotateX = 0; }

          const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

          $slideEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
          if (params.slideShadows) {
            // Set shadows
            let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append($shadowBeforeEl);
            }
            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append($shadowAfterEl);
            }
            if ($shadowBeforeEl.length) { $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0; }
            if ($shadowAfterEl.length) { $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0; }
          }
        }

        // Set correct perspective for IE10
        if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
          const ws = $wrapperEl[0].style;
          ws.perspectiveOrigin = `${center}px 50%`;
        }
      },
      setTransition(duration) {
        const swiper = this;
        swiper.slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
      }
    }
  };


  apkey: string;
  password: string;
  showPassword: boolean;
  showLoginSection: boolean;

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
    private storage: Storage,
    private toastCtrl: ToastController,
    private ws: WsApiService,
    private news: NewsService
  ) {
  }

  ngOnInit() {
    const rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/;
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
      })
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
    );

    const headers = { 'X-Filename': 'quix-customers' };
    return this.quixCompanies$ = this.ws.get<QuixCustomer[]>('/quix/get/file', {
      auth: false,
      caching: 'cache-only',
      headers
    }
    ).pipe(map(_ => {
      // TODO: remove this (for testing only)
      return [
        {
          company_departments: [
            {
              dept_email: 'admin@apu.edu.my',
              dept_icon: 'chatbubbles-sharp',
              dept_icon_color: '#1f640a',
              dept_id: 'adm',
              dept_name: 'admin',
              dept_phone: [
                '03 8992 5250'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '19:30:00',
                    start_time: '08:30:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '20:00:00',
                    start_time: '08:30:00'
                  }
                ],
                Sat: [
                  {
                    end_time: '13:00:00',
                    start_time: '09:00:00'
                  }
                ]
              }
            },
            {
              dept_email: 'visa@apu.edu.my',
              dept_icon: 'airplane',
              dept_icon_color: '#260033',
              dept_id: 'immig',
              dept_name: 'immigration',
              dept_phone: [
                '03 8992 5237',
                '03 8992 5238',
                '03 8992 5239'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '15:45:00',
                    start_time: '09:00:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '16:45:00',
                    start_time: '09:00:00'
                  }
                ],
                Sat: []
              }
            },
            {
              dept_email: 'bursary@apu.edu.my',
              dept_icon: 'cash-outline',
              dept_icon_color: '#bc8420',
              dept_id: 'cash',
              dept_name: 'cashier',
              dept_phone: [
                '03 8992 5228'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '18:15:00',
                    start_time: '09:15:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '18:15:00',
                    start_time: '09:15:00'
                  }
                ],
                Sat: [
                  {
                    end_time: '13:00:00',
                    start_time: '09:15:00'
                  }
                ]
              }
            },
            {
              dept_email: 'klinikoceana@gmail.com',
              dept_icon: 'bandage-outline',
              dept_icon_color: '#E8222D',
              dept_id: 'clinic',
              dept_name: 'clinic',
              dept_phone: [
                '03 8992 5114'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '17:00:00',
                    start_time: '09:00:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '17:00:00',
                    start_time: '09:00:00'
                  }
                ],
                Sat: []
              }
            },
            {
              dept_email: 'info@apu.edu.my',
              dept_icon: 'help-circle-sharp',
              dept_icon_color: '#235789',
              dept_id: 'ss',
              dept_name: 'Student Service',
              dept_phone: [
                '03 8992 5211',
                '03 8992 5212'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '19:00:00',
                    start_time: '08:30:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '19:00:00',
                    start_time: '08:30:00'
                  }
                ],
                Sat: [
                  {
                    end_time: '13:00:00',
                    start_time: '08:30:00'
                  }
                ]
              }
            },
            {
              dept_email: 'rsvp@apu.edu.my',
              dept_icon: 'business-sharp',
              dept_icon_color: '#F0CEA0',
              dept_id: 'acc',
              dept_name: 'Accommodation',
              dept_phone: [
                '03 8992 5040',
                '03 8992 5041'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '13:00:00',
                    start_time: '10:30:00'
                  },
                  {
                    end_time: '17:00:00',
                    start_time: '14:30:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '13:00:00',
                    start_time: '10:30:00'
                  },
                  {
                    end_time: '17:30:00',
                    start_time: '14:30:00'
                  }
                ],
                Sat: []
              }
            },
            {
              dept_email: 'library@apu.edu.my',
              dept_icon: 'library',
              dept_icon_color: '#5bc0be',
              dept_id: 'lib',
              dept_name: 'Library',
              dept_phone: [
                '03 8992 5207'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '20:00:00',
                    start_time: '08:30:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '20:00:00',
                    start_time: '08:30:00'
                  }
                ],
                Sat: [
                  {
                    end_time: '13:00:00',
                    start_time: '09:00:00'
                  }
                ]
              }
            },
            {
              dept_email: 'assist@apu.edu.my',
              dept_icon: 'laptop-sharp',
              dept_icon_color: '#0b132b',
              dept_id: 'tl',
              dept_name: 'Technology Labs',
              dept_phone: [
                '03 8992 5252'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '19:00:00',
                    start_time: '08:30:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '19:00:00',
                    start_time: '08:30:00'
                  }
                ],
                Sat: [
                  {
                    end_time: '13:00:00',
                    start_time: '09:00:00'
                  }
                ]
              }
            },
            {
              dept_email: '',
              dept_icon: 'print-outline',
              dept_icon_color: '#e42c64',
              dept_id: 'ps',
              dept_name: 'Printshop @APU',
              dept_phone: [
                '03 8992 5171 '
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '12:45:00',
                    start_time: '10:30:00'
                  },
                  {
                    end_time: '19:00:00',
                    start_time: '14:45:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '19:00:00',
                    start_time: '10:30:00'
                  }
                ],
                Sat: []
              }
            }
          ],
          company_id: 'APU',
          company_name: 'Asia Pacific University',
          customer_type: 'Student',
          lastModified: '2020-06-22 12:17:06+00:00'
        },
        {
          company_departments: [
            {
              dept_email: 'library@apu.edu.my',
              dept_icon: 'library',
              dept_icon_color: '#5bc0be',
              dept_id: 'apiit-lib',
              dept_name: 'Library',
              dept_phone: [
                '03 8992 5207'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '18:00:00',
                    start_time: '08:30:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '18:00:00',
                    start_time: '08:30:00'
                  }
                ],
                Sat: []
              }
            },
            {
              dept_email: 'bursary@apu.edu.my',
              dept_icon: 'cash-outline',
              dept_icon_color: '#bc8420',
              dept_id: 'apiit-cash',
              dept_name: 'Cashier',
              dept_phone: [
                '03 8992 5228'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '13:00:00',
                    start_time: '10:00:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '13:00:00',
                    start_time: '10:00:00'
                  }
                ],
                Sat: []
              }
            },
            {
              dept_email: 'assist@apu.edu.my',
              dept_icon: 'laptop-sharp',
              dept_icon_color: '#0b132b',
              dept_id: 'apiit-tl',
              dept_name: 'Technology Labs',
              dept_phone: [
                '03 8992 5252'
              ],
              shifts: {
                Fri: [
                  {
                    end_time: '19:00:00',
                    start_time: '8:30:00'
                  }
                ],
                'Mon-Thu': [
                  {
                    end_time: '19:00:00',
                    start_time: '8:30:00'
                  }
                ],
                Sat: []
              }
            }
          ],
          company_id: 'APIIT',
          company_name: 'Asia Pacific Institute of Information Technology',
          customer_type: 'Lecturer'
        }
      ];
    }));
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
        tap(() => this.settings.initialSync()),
        tap(role => this.cacheApi(role)),
        timeout(15000),
      ).subscribe(
        _ => {
          // TODO default dashboard settings
        },
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
          if (this.settings.get('dashboardSections').length === 0) {
            this.storage.get('role').then((role: Role) => {
              // tslint:disable-next-line:no-bitwise
              if (role & Role.Student) {
                this.settings.set('dashboardSections', [
                  'quickAccess',
                  'todaysSchedule',
                  'upcomingEvents',
                  'lowAttendance',
                  'upcomingTrips',
                  'apcard',
                  'cgpa',
                  'financials',
                  'news',
                  'noticeBoard'
                ]);
                // tslint:disable-next-line:no-bitwise
              } else if (role & (Role.Lecturer | Role.Admin)) {
                this.settings.set('dashboardSections', [
                  'inspirationalQuote',
                  'todaysSchedule',
                  'upcomingEvents',
                  'upcomingTrips',
                  'apcard',
                  'news',
                  'noticeBoard'
                ]);
              }
            });
          }
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
            this.openLink('troubleshooting');
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

  openLink(
    linkName: 'timetable' | 'holiday' | 'moodle' | 'graduation' | 'apkey' | 'apkeyPassword' | 'troubleshooting' | 'apu' | 'aplc' | 'apiit' | 'corporateTraining' | 'facebook' | 'twitter' | 'linkedin' | 'playStore' | 'appStore' | 'privacyPolicy' | 'termsOfUse') {
    let url = '';
    switch (linkName) {
      case 'timetable':
        url = 'https://apspace.apu.edu.my/student-timetable';
        break;
      case 'holiday':
        url = 'https://cdn.webspace.apiit.edu.my/public/2020-04/2020%20APU%20student%20holidays-update.pdf';
        break;
      case 'moodle':
        url = 'https://lms2.apiit.edu.my/login/index.php?authCAS=CAS';
        break;
      case 'graduation':
        url = 'https://graduation.sites.apiit.edu.my/';
        break;
      case 'apkey':
        url = 'https://apiit.atlassian.net/servicedesk/customer/portal/4/article/219086900';
        break;
      case 'apkeyPassword':
        url = 'https://apiit.atlassian.net/servicedesk/customer/kb/view/218759221';
        break;
      case 'troubleshooting':
        url = 'https://apiit.atlassian.net/servicedesk/customer/kb/view/218726429';
        break;
      case 'apu':
        url = 'https://www.apu.edu.my/';
        break;
      case 'apiit':
        url = 'https://www.apu.edu.my/';
        break;
      case 'corporateTraining':
        url = 'https://www.apu.edu.my/our-courses/corporate-training';
        break;
      case 'aplc':
        url = 'https://www.apu.edu.my/our-courses/english-language-study';
        break;
      case 'facebook':
        url = 'https://www.facebook.com/apuniversity/';
        break;
      case 'twitter':
        url = 'https://twitter.com/AsiaPacificU';
        break;
      case 'linkedin':
        url = 'https://www.linkedin.com/edu/school?id=15321&trk=edu-cp-title';
        break;
      case 'playStore':
        url = 'https://play.google.com/store/apps/details?id=my.edu.apiit.apspace';
        break;
      case 'appStore':
        url = 'https://itunes.apple.com/us/app/apspace/id1413678891';
        break;
      case 'privacyPolicy':
        url = 'https://www.apu.edu.my/privacy-policy-0';
        break;
      case 'termsOfUse':
        url = 'https://www.apu.edu.my/terms-use';
        break;
      default:
        break;
    }
    this.iab.create(url, '_system', 'location=true');

  }

  // SLIDER
  prevSlide() {
    this.sliderSlides.slidePrev();
  }

  nextSlide() {
    this.sliderSlides.slideNext();
  }

}
