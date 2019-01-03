import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { CasTicketProvider } from './cas-ticket';

@Injectable()
export class SlotsProvider {

  // add AvailabilityRules API url
  AvailabilityRulesSlotsUrl = 'https://api.apiit.edu.my/iconsult/lecaddfreeslots';

  // lec add cancel freeslot
  cancelslotUrl = 'https://api.apiit.edu.my/iconsult/lecCancelfreeslot';

  // get AvailabilityRules and rules API url
  AvailabilityRulesDetailsUrl = 'https://api.apiit.edu.my/iconsult/rulesdetails';

  // add UnAvailabilityRules API url
  UnvailabilityRulesSlotsUrl = 'https://api.apiit.edu.my/iconsult/lec_add_UnFreeSlotsRules';

  // Get user name API url
  getusername = 'https://api.apiit.edu.my/iconsult/getusername';

  // Get rooms name API url
  getroomsurl = 'https://api.apiit.edu.my/iconsult/getvenues';

  constructor(public http: HttpClient, private cas: CasTicketProvider) {

  }

  /**
   * GET Method: get lecturer's free slots details.
   */
  getrulesDetails(id): Observable<any[]> {
    return this.http.get<any[]>(this.AvailabilityRulesDetailsUrl + '/' + id,
      { withCredentials: true }).do(res => console.log(res));
  }

  /**
   * POST Method: add lecturer's free slots.
   */
  addfreeslots(freeslots): Observable<any> {
    return this.cas.getST(this.AvailabilityRulesSlotsUrl).pipe(
      switchMap(st => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'my-auth-token',
          }),
          withCredentials: true,
        };
        const url = `${this.AvailabilityRulesSlotsUrl}?ticket=${st}`;
        return this.http.post(url, freeslots, httpOptions);
      }),
    );
  }

  /**
   * POST Method: add lecturer's canceled slots.
   */
  addCanceledslot(canceledslots) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.post(this.cancelslotUrl, canceledslots, httpOptions);

  }

  /**
   * POST Method: add lecturer's Unfree slots.
   */
  addUnfreeslots(unfreeslots) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,

    };
    return this.http.post(this.UnvailabilityRulesSlotsUrl, unfreeslots, httpOptions);
  }

  getrooms(venue: string): Observable<any> {
    return this.cas.getST(this.getroomsurl).pipe(
      switchMap(st => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'my-auth-token',
          }),
          withCredentials: true,
        };
        const url = `${this.getroomsurl}/${venue}?ticket=${st}`;
        return this.http.get(url, httpOptions);
      }),
    );
  }

}
