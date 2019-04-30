import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { GetRooms, LecGetRulesDet } from '../interfaces';
import { CasTicketProvider } from './cas-ticket';
import { WsApiProvider } from './ws-api';

@Injectable()
export class SlotsProvider {

  // add AvailabilityRules API url
  AvailabilityRulesSlotsUrl = '/iconsult/lecaddfreeslots';

  // lec add cancel freeslot
  cancelslotUrl = '/iconsult/lecCancelfreeslot';

  // get AvailabilityRules and rules API url
  AvailabilityRulesDetailsUrl = '/iconsult/rulesdetails';

  // add UnAvailabilityRules API url
  UnvailabilityRulesSlotsUrl = '/iconsult/lecturer_add_unavailability';

  // Get user name API url
  getusername = '/iconsult/getusername';

  // Get rooms name API url
  getroomsurl = '/iconsult/getvenues';

  constructor(public http: HttpClient, private cas: CasTicketProvider, private ws: WsApiProvider,
  ) {

  }

  /**
   * GET Method: get lecturer's free slots details.
   */
  getrulesDetails(id): Observable<LecGetRulesDet[]> {
    return this.ws.get<LecGetRulesDet[]>('/iconsult/rulesdetails/' + id, true, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  /**
   * POST Method: add lecturer's free slots.
   */
  addfreeslots(freeslots): Observable<any> {
    return this.ws.post<any>(this.AvailabilityRulesSlotsUrl, {
      body: freeslots,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  /**
   * POST Method: add lecturer's canceled slots.
   */
  addCanceledslot(canceledslots) {
    return this.ws.post<any>(this.cancelslotUrl, {
      body: canceledslots,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  /**
   * POST Method: add lecturer's Unfree slots.
   */
  addUnfreeslots(unfreeslots) {
    return this.ws.post<any>(this.UnvailabilityRulesSlotsUrl, {
      body: unfreeslots,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  getrooms(venue: string): Observable<GetRooms[]> {
    return this.ws.get<GetRooms[]>('/iconsult/getvenues/' + venue, true, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

}
