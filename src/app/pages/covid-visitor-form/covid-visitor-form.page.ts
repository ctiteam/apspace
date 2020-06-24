import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable, Subscription, of, timer } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Role, StaffProfile, StudentProfile } from 'src/app/interfaces';
import { SettingsService, WsApiService } from 'src/app/services';
import { VisitHistoryModalPage } from './visit-history/visit-history-modal';

@Component({
  selector: 'app-covid-visitor-form',
  templateUrl: './covid-visitor-form.page.html',
  styleUrls: ['./covid-visitor-form.page.scss'],
})
export class CovidVisitorFormPage implements OnInit {
  // THIS REGULAR EXPERSSION FOLLOWS THE RFC 2822 STANDARD
  // tslint:disable-next-line: max-line-length
  emailValidationPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  phoneNumberValidationPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,5})$/;
  loading: HTMLIonLoadingElement;

  phoneNumberValid = false;
  emailValid = false;
  temperatureValid = false;
  showWelcomeMessage = false;
  declarationLog$: Observable<any>;
  showLocationOption = false;

  timer$ = timer(0, 1000);
  timerSubscription$: Subscription;
  counter: Date;
  sessionExpired = false;
  visitPurposes = [
    'Supplier/Vendor/Contractor/Delivery',
    'Corporate Training',
    'Course Enquiry/Campus Tour',
    'Fee Payment',
    'Meeting/interview',
    'APU Student/Staff'
  ];
  userName$: Observable<string>;

  response = {
    name: '',
    email: '',
    phoneNumber: '',
    temperature: '',
    purposeOfVisit: '',
    declared: false,
    role: 'visitor',
    id: '',
    station: ''
  };
  constructor(
    private settings: SettingsService,
    private ws: WsApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private changeDetRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.settings.ready().then(() => {
      console.log('settings are ready');
      const role = this.settings.get('role');
      if (role) {
        this.declarationLog$ = this.ws.get('/covid/declaration_log').pipe(
          tap(res => {
            console.log(res);
            if (res && res.is_valid) {
              const validUntil = new Date(res.valid_time);
              const currentDate = new Date();
              this.startTimer(moment(validUntil).diff(moment(currentDate), 'seconds'));
              // const navigationExtras: NavigationExtras = {
              //   state: { new: false, data: res }
              // };
              // this.router.navigateByUrl('visitor-session-pass', navigationExtras);
            } else {
              this.response.station = this.route.snapshot.paramMap.get('location');
              if (!this.response.station) {
                this.showLocationOption = true;
              }
            }
          })
        );
      } else {
        this.declarationLog$ = of({ is_valid: false });
        this.response.station = this.route.snapshot.paramMap.get('location');
        if (!this.response.station) {
          this.showLocationOption = true;
        }
      }
      // tslint:disable-next-line: no-bitwise
      if (role & Role.Student) {
        this.response.role = 'student';
        this.userName$ = this.ws.get<StudentProfile>('/student/profile').pipe(
          map(res => res.NAME),
          shareReplay(1),
        );
        // tslint:disable-next-line: no-bitwise
      } else if (role & (Role.Lecturer | Role.Admin)) {
        this.response.role = 'staff';
        this.userName$ = this.ws.get<StaffProfile[]>('/staff/profile').pipe(
          map(res => res[0].FULLNAME),
          shareReplay(1),
        );
      }
    });
  }

  checkValue(itemToCheck: string) {
    if (itemToCheck === 'phone') {
      this.phoneNumberValid = this.response.phoneNumber.match(this.phoneNumberValidationPattern) !== null;
    } else if (itemToCheck === 'email') {
      this.emailValid = this.response.email.match(this.emailValidationPattern) !== null;
    } else if (itemToCheck === 'temperature') {
      this.temperatureValid = +this.response.temperature > 30 && +this.response.temperature <= 45;
    }
  }

  clearForm(currentRole: string, currentStation) {
    this.response = {
      name: '',
      email: '',
      phoneNumber: '',
      temperature: '',
      purposeOfVisit: '',
      declared: false,
      role: currentRole,
      id: '',
      station: currentStation
    };
  }

  startTimer(counterValueInSeconds: number) {
    const counterValue = moment('2015-01-01').startOf('day')
      .seconds(counterValueInSeconds);
    this.timerSubscription$ = this.timer$.subscribe(t => {
      this.counter = counterValue.toDate();
      // this.counter = new Date(0, 0, 0, 0, 0, 2);
      this.counter.setSeconds(this.counter.getSeconds() - t);
      if (this.counter.getHours() === 0 && this.counter.getMinutes() === 0 && this.counter.getSeconds() === 0) {
        console.log('toto');
        // this.showButtons = true;
        this.sessionExpired = true;
        this.timerSubscription$.unsubscribe();
      }
    });
  }

  generateNewSession() {
    this.getData();
    this.changeDetRef.detectChanges();
  }

  scanQrCode() {

  }

  async viewHistory() {
    const modal = await this.modalCtrl.create({
      component: VisitHistoryModalPage,
      cssClass: 'custom-modal-style',
      componentProps: {
        show: 'history'
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data.data) {
        // this.classcode = data.data.code;
        // this.classType = data.data.type;
      }
    });
  }

  async openReadMoreModal() {
    const modal = await this.modalCtrl.create({
      component: VisitHistoryModalPage,
      cssClass: 'custom-modal-style',
      componentProps: {
        show: 'symptoms'
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data.data) {
        // this.classcode = data.data.code;
        // this.classType = data.data.type;
      }
    });
  }

  submitForm() {
    if (!this.response.declared) {
      this.presentToast('Declaration is Required!!', 6000, 'danger');
    } else {
      if (this.response.role === 'visitor') {
        this.presentLoading();
        const body = {
          full_name: this.response.name,
          purpose: this.response.purposeOfVisit,
          email: this.response.email,
          phone: this.response.phoneNumber,
          temperature: `${this.response.temperature}`,
          station: this.response.station
        };
        if (this.response.purposeOfVisit === 'APU Student/Staff') {
          // tslint:disable-next-line: no-string-literal
          body['sam_account_name'] = this.response.id;
        }
        this.ws.post('/covid/visitor', { body, auth: false }).subscribe(
          res => console.log(res),
          err => console.log(err),
          () => {
            this.dismissLoading();
            this.presentToast('Form Submitted Successfully!', 6000, 'success');
            this.clearForm(this.response.role, this.response.station);
            this.showWelcomeMessage = true;
          }
        );
      } else {
        this.presentLoading();
        const body = {
          role: this.response.role
        };
        this.ws.post('/covid/declaration', { body }).subscribe(
          res => console.log(res),
          err => console.log(err),
          () => {
            this.dismissLoading();
            this.clearForm(this.response.role, this.response.station);
            this.presentToast('Form Submitted Successfully!', 6000, 'success');
            this.getData();
            this.changeDetRef.detectChanges();
          }
        );
      }
    }
  }

  async presentToast(msg: string, duration: number, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color,
      duration,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

}
