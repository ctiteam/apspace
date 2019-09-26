import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Chart } from 'chart.js';

import { StudentProfile, VisaDetails, CountryData } from '../../interfaces';

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
  // skeleton
  skeletons = new Array(5);


  constructor(
    private ws: WsApiService,
    private settings: SettingsService,
  ) { }

  ngOnInit() {
    this.getProfile();

  }

  getProfile() {
    this.ws.get<StudentProfile>('/student/profile').pipe(
      tap(p => {
        this.countryName = p.COUNTRY;
        this.passportNumber = p.IC_PASSPORT_NO;
        if (p.COUNTRY === 'Malaysia') {
          this.local = true;
        } else {
          this.local = false;
          this.getAlpha3Code();

        }
      }),
    ).subscribe();

  }

  getAlpha3Code() {
    this.ws.get<CountryData[]>(`/name/${this.countryName}?fields=name;alpha3Code`, false, {
      url: 'https://restcountries.eu/rest/v2',
      auth: false,
    }).pipe(
      tap(res => this.alpha3Code = res[0].alpha3Code),
      tap(_ => this.getVisa()),

    ).subscribe();

  }

  getVisa() {

    this.visa$ = this.ws.get<VisaDetails>(`/student/visa_renewal_status/${this.alpha3Code}/${this.passportNumber}`, false, {
      auth: false,
      // tslint:disable-next-line: semicolon
    });
  }

  showHide() {
    this.historyStatus = !this.historyStatus;
  }
}


