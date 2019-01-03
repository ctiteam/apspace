import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { CasTicketProvider } from './cas-ticket';

@Injectable()
export class UpcomingConStuProvider {

  // Slots API URL
  upcomingConStu = 'https://api.apiit.edu.my/iconsult/upcomingconstu';

  // AvailabilityRules API URL
  detailPage = 'https://api.apiit.edu.my/iconsult/detailpageconstu';

  // Get Slots (for students) API URL
  getslots = 'https://api.apiit.edu.my/iconsult/freeslots';

  // add Slots (for students) API URL
  addBookingUrl = 'https://api.apiit.edu.my/iconsult/addbooking';

  // Get user name API url
  getusername = 'https://api.apiit.edu.my/iconsult/getusername';

  // lec add canceled booked slot
  updatebookedsloturl = 'https://api.apiit.edu.my/iconsult/lecCancelbookedslot';

  // student verify duplicate slot
  verifyDupSlotUrl = 'https://api.apiit.edu.my/iconsult/verifyduplicateslot';

  constructor(public http: HttpClient, private cas: CasTicketProvider) {
  }

  getUpcomingConStu(): Observable<any[]> {
    return this.cas.getST(this.upcomingConStu).pipe(
      switchMap(st => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'my-auth-token',
          }),
          withCredentials: true,
        };
        const url = `${this.upcomingConStu}?ticket=${st}`;
        return this.http.get<any[]>(url, httpOptions).do(res => console.log(res));
      }),
    );

  }

  getDetailPageStu(id): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.get<any[]>(this.detailPage + '/' + id, httpOptions).do(res => console.log(res));
  }

  getSlots(casId): Observable<any[]> {
    return this.cas.getST(this.getslots).pipe(
      switchMap(st => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'my-auth-token',
          }),
          withCredentials: true,
        };
        const url = `${this.getslots}/${casId}?ticket=${st}`;
        return this.http.get<any[]>(url, httpOptions);
      }),
    );

  }

  addbooking(booking) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.post(this.addBookingUrl, booking, httpOptions);
  }

  getstaffname(casid: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,

    };
    return this.http.get(`${this.getusername}/${casid}`, httpOptions);
  }

  /**
   * POST Method: add student cancel booked slots.
   */
  cancelbookedslot(cancelbookedslots) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.post(this.updatebookedsloturl, cancelbookedslots, httpOptions);

  }

  verifyduplicateslotsfun(usefuldata: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.get(`${this.verifyDupSlotUrl}/${usefuldata}`, httpOptions);

  }

}
