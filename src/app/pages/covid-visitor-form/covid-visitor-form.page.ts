import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  phoneNumberValid = false;
  emailValid = false;
  temperatureValid = false;

  visitPurposes = ['Enquiry', 'Fee Payment', 'Campus Tour', 'Meeting', 'Vendor/Supplier', 'APU Student/Staff'];
  userName$: Observable<string>;

  response = {
    name: '',
    gender: '',
    email: '',
    phoneNumber: '',
    temperature: '',
    purposeOfVisit: '',
    declared: false,
    role: 'visitor',
    id: ''
  };
  constructor(
    private settings: SettingsService,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.settings.ready().then(() => {
      const role = this.settings.get('role');
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

  submitForm() {
    if (this.response.purposeOfVisit !== 'APU Student/Staff') {
      delete this.response.id;
    }
    console.log(this.response);
  }

}
