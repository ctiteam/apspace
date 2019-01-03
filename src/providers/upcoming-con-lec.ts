import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { CasTicketProvider } from './cas-ticket';

@Injectable()
export class UpcomingConLecProvider {

  // Slots API URL
  upcomingConLec = 'https://api.apiit.edu.my/iconsult/freeslotslec';

  // AvailabilityRules API URL
  detailPage = 'https://api.apiit.edu.my/iconsult/detailpage';

  // lec add canceled booked slot
  updatebookedsloturl = 'https://api.apiit.edu.my/iconsult/lecCancelbookedslot';

  // lec get rule details
  unavaildetails = 'https://api.apiit.edu.my/iconsult/get_unavailrule_details';

  // lec get starttimes
  starttimes = 'https://api.apiit.edu.my/iconsult/get_all_starttime';

  // lec add canceled booked slot
  unavailabilityRulesUpdate = 'https://api.apiit.edu.my/iconsult/UnavailabilityRules_update';

  // lec add feedback
  feedbackurl = 'https://api.apiit.edu.my/iconsult/lecaddfeedback';

  // lec get feedback
  getfeedbackurl = 'https://api.apiit.edu.my/iconsult/lecgetfeedback';

  constructor(public http: HttpClient, private cas: CasTicketProvider) {
  }

  getUpcomingConLec(): Observable<any> {
    return this.cas.getST(this.upcomingConLec).pipe(
      switchMap(st => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'my-auth-token',
          }),
          withCredentials: true,
        };
        const url = `${this.upcomingConLec}?ticket=${st}`;
        return this.http.get(url, httpOptions);
      }),
    );
  }

  getDetailPage(id): Observable<any[]> {
    return this.http.get<any[]>(this.detailPage + '/' + id).do(res => console.log(res));
  }

  getUnavailrulesdetails(unavailibilityid): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.get<any[]>(this.unavaildetails + '/' + unavailibilityid, httpOptions).do(res => console.log(res));
  }

  getallstarttimes(unavailibilityId): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.get<any[]>(this.starttimes + '/' + unavailibilityId, httpOptions).do(res => console.log(res));
  }

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

  disableunailrules(unavailibilityid, disableunavailslots) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.put(this.unavailabilityRulesUpdate + '/' + unavailibilityid, disableunavailslots, httpOptions);

  }

  addlecFeedback(lecfeedback) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      }),
      withCredentials: true,
    };
    return this.http.post(this.feedbackurl, lecfeedback, httpOptions);

  }

  getfeedback(id): Observable<any[]> {
    return this.http.get<any[]>(this.getfeedbackurl + '/' + id, { withCredentials: true }).do(res => console.log(res));
  }

}
