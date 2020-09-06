import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { CountryData, Role, StudentProfile, VisaDetails } from '../../interfaces';
import { WsApiService } from '../../services';

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
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.storage.get('role').then((role: Role) => {
      // tslint:disable-next-line: no-bitwise
      if (role & Role.Student) {
        this.sendRequest = true;
        this.getProfile();
      }
    });
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
    const caching = refresher ? 'network-or-cache' : 'cache-only';

    if (!(this.alpha3Code && this.passportNumber)) {
      this.toastCtrl.create({
        message: 'You cannot search or refresh while having a blank field.',
        duration: 5000,
        position: 'top',
        color: 'danger',
        animated: true,
        buttons: [
          {
            text: 'Close',
            role: 'cancel'
          }
        ],
      }).then(toast => {
        toast.present();
      });

      if (refresher) {
        refresher.target.complete();
      }

      return;
    }

    this.sendRequest = true;
    this.visa$ = this.ws.get<VisaDetails>(`/student/visa_renewal_status/${this.alpha3Code}/${this.passportNumber}`, {
      auth: false,
      caching,
    }).pipe(
      finalize(() => refresher && refresher.target.complete())
    );
  }

  trackAnotherApplication() {
    this.local = false;
  }
}
