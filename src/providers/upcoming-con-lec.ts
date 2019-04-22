import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { publishLast, refCount } from 'rxjs/operators';

import { ConDetail, Feedback, FreeSlotsLec, Starttimes, UnavailruleDet } from '../interfaces';
import { CasTicketProvider } from './cas-ticket';
import { WsApiProvider } from './ws-api';

@Injectable()
export class UpcomingConLecProvider {
  DevUrl = "http://127.0.0.1:5000";
  // Slots API URL
  upcomingConLec = '/iconsult/freeslotslec';

  // AvailabilityRules API URL
  detailPage = '/iconsult/detailpage';

  // lec add canceled booked slot
  updatebookedsloturl = '/iconsult/lecCancelbookedslot';

  // lec get rule details
  unavaildetails = '/iconsult/get_unavailrule_details';

  // lec get starttimes
  starttimes = '/iconsult/get_all_starttime';

  // lec add canceled booked slot
  unavailabilityRulesUpdate = '/iconsult/UnavailabilityRules_update';

  // lec add feedback
  feedbackurl = '/iconsult/lecaddfeedback';

  // lec get feedback
  getfeedbackurl = '/iconsult/lecgetfeedback';

  // user logout session
  userlogoutsession = '/iconsult/close-session';

  constructor(public http: HttpClient,
    private cas: CasTicketProvider,
    private ws: WsApiProvider,
  ) {
  }

  getUpcomingConLec(): Observable<FreeSlotsLec[]> {
    return this.ws.get<FreeSlotsLec[]>('/iconsult/upcomingconlec', true, {
      url : this.DevUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  getDetailPage(id): Observable<ConDetail[]> {
    return this.ws.get<ConDetail[]>('/iconsult/detailpage/' + id, true, {
      url : this.DevUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  getUnavailrulesdetails(unavailibilityid): Observable<UnavailruleDet[]> {
    return this.ws.get<UnavailruleDet[]>('/iconsult/get_unavailrule_details/' + unavailibilityid, true, {
      url : this.DevUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  getallstarttimes(unavailibilityId): Observable<Starttimes[]> {
    return this.ws.get<Starttimes[]>('/iconsult/get_all_starttime/' + unavailibilityId, true, {
      url : this.DevUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  cancelbookedslot(cancelbookedslots) {
    return this.ws.post<any>(this.updatebookedsloturl, {
      body: cancelbookedslots,
      url : this.DevUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  disableunailrules(unavailibilityid, disableunavailslots) {
    return this.ws.put<any>(this.unavailabilityRulesUpdate + '/' + unavailibilityid, {
      body: disableunavailslots,
      url : this.DevUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  addlecFeedback(lecfeedback: { slotid: number; entry_datetime: string; feedback: string; gims_status: number; }): Observable<any> {
    return this.ws.post<any>(this.feedbackurl, {
      body: lecfeedback,
      url : this.DevUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  getfeedback(id): Observable<Feedback[]> {
    return this.ws.get<Feedback[]>('/iconsult/lecgetfeedback/' + id, true, {
      url : this.DevUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

}
