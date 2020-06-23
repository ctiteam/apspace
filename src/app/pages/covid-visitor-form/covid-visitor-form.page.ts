import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Role, StaffProfile, StudentProfile } from 'src/app/interfaces';
import { SettingsService, WsApiService } from 'src/app/services';

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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.response.station = this.route.snapshot.paramMap.get('location');
    console.log(this.route.snapshot.paramMap.get('location'));
    if (!this.response.station) {
      this.presentToast('Location param is missing from the URL on top. Please add ;location=your_location on top', 10000, 'danger');
    }
    this.settings.ready().then(() => {
      const role = this.settings.get('role');
      if (role) {
        this.declarationLog$ = this.ws.get('/covid/declaration_log').pipe(
          tap(res => {
            console.log(res);
            if (res && res.is_valid) {
              const navigationExtras: NavigationExtras = {
                state: { new: false, data: res }
              };
              this.router.navigateByUrl('visitor-session-pass', navigationExtras);
            }
          })
        );
      } else {
        this.declarationLog$ = of({ is_valid: false });
      }
      // tslint:disable-next-line: no-bitwise
      if (role & Role.Student) {
        this.response.role = 'student';
        this.userName$ = this.ws.get<StudentProfile>('/student/profile').pipe(
          map(res => res.NAME)
        );
        // tslint:disable-next-line: no-bitwise
      } else if (role & (Role.Lecturer | Role.Admin)) {
        this.response.role = 'staff';
        this.userName$ = this.ws.get<StaffProfile[]>('/staff/profile').pipe(
          map(res => res[0].FULLNAME)
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
          temperature: this.response.temperature,
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
        this.ws.post('/covid/declaration').subscribe(
          res => console.log(res),
          err => console.log(err),
          () => {
            this.dismissLoading();
            this.clearForm(this.response.role, this.response.station);
            this.presentToast('Form Submitted Successfully!', 6000, 'success');
            const navigationExtras: NavigationExtras = {
              state: { new: true, data: null }
            };
            this.router.navigateByUrl('visitor-session-pass', navigationExtras);
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
