import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { CountryData, Role, StudentProfile, VisaDetails } from '../../interfaces';

import { ToastController } from '@ionic/angular';
import { SettingsService, WsApiService } from '../../services';

@Component({
  selector: 'app-visa-status',
  templateUrl: './visa-status.page.html',
  styleUrls: ['./visa-status.page.scss'],
})
export class VisaStatusPage implements OnInit {
  // observables
  profile$: Observable<StudentProfile>;
  visa$: Observable<VisaDetails>;
  countryAlpha3Code$: Observable<CountryData[]>;

  // handle errors for locals
  local = false;
  // used to show and hide card
  historyStatus = true;

  countryName: string;
  passportNumber: string;
  alpha3Code = '';
  listOfCountries: CountryData[];
  sendRequest = false;
  // skeleton
  skeletons = new Array(5);

  constructor(
    public toastCtrl: ToastController,
    private ws: WsApiService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: no-bitwise
    if (this.settings.get('role') & Role.Student) {
      this.sendRequest = true;
      this.getProfile();
    }
    this.getListOfCountries(); // get the list of countries when the page loads and add the data to ion-select
  }

  getListOfCountries() {
    this.ws.get<CountryData[]>(`/all/?fields=name;alpha3Code`, {
      url: 'https://restcountries.eu/rest/v2',
      auth: false,
      caching: 'cache-only',
    }).pipe(
      tap(res => this.listOfCountries = res),
    ).subscribe();
  }

  getProfile() {
    this.ws.get<StudentProfile>('/student/profile', { caching: 'cache-only' }).pipe(
      tap(p => {
        this.countryName = p.COUNTRY;
        this.passportNumber = p.IC_PASSPORT_NO;
        if (p.COUNTRY === 'Malaysia') {
          this.local = true;
        } else {
          this.local = false;
        }
        this.getAlpha3Code();
      }),
    ).subscribe();
  }

  getAlpha3Code() {
    // alpha 3 code example: Libya => LBY
    this.ws.get<CountryData[]>(`/name/${this.countryName}?fields=name;alpha3Code`, {
      url: 'https://restcountries.eu/rest/v2',
      auth: false,
      caching: 'cache-only',
    }).pipe(
      tap(res => this.alpha3Code = res[0].alpha3Code),
      tap(_ => this.getVisa()),
    ).subscribe();
  }

  getVisa(refresher?) {
    if (!(this.alpha3Code && this.passportNumber)) {
      this.toastCtrl.create({
        message: 'You cannot search or refresh while having a blank field.',
        duration: 5000,
        position: 'top',
        color: 'danger',
        showCloseButton: true,
        animated: true
      }).then(toast => {
        toast.present();
      });
      refresher.target.complete();
      return;
    }

    this.sendRequest = true;
    this.visa$ = this.ws.get<VisaDetails>(`/student/visa_renewal_status/${this.alpha3Code}/${this.passportNumber}`, {
      auth: false,
      caching: 'cache-only',
    }).pipe(
      tap(r => console.log(r)),
      finalize(() => refresher && refresher.target.complete())
    );
  }

  toggleHistoryCard() {
    this.historyStatus = !this.historyStatus;
  }

  trackAnotherApplication() {
    this.local = false;
  }
}
