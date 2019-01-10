import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { DepName, DetailpageStudent, FreeSlots, StaffName, Upcomingcon } from '../interfaces';
import { CasTicketProvider } from './cas-ticket';
import { WsApiProvider } from './ws-api';

@Injectable()
export class UpcomingConStuProvider {

  // Slots API URL
  upcomingConStu = '/iconsult/upcomingconstu';

  // AvailabilityRules API URL
  detailPage = '/iconsult/detailpageconstu';

  // Get Slots (for students) API URL
  getslots = '/iconsult/freeslots';

  // add Slots (for students) API URL
  addBookingUrl = '/iconsult/addbooking';

  // Get user name API url
  getusername = '/iconsult/getusername';

  // lec add canceled booked slot
  updatebookedsloturl = '/iconsult/lecCancelbookedslot';

  // student verify duplicate slot
  verifyDupSlotUrl = '/iconsult/verifyduplicateslot';

  constructor(public http: HttpClient, private cas: CasTicketProvider, private ws: WsApiProvider,
) {
  }

  getUpcomingConStu(): Observable<Upcomingcon[]> {
             return this.ws.get<Upcomingcon[]>('/iconsult/upcomingconstu', true, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  getDetailPageStu(id): Observable<DetailpageStudent[]> {
    return this.ws.get<DetailpageStudent[]>('/iconsult/detailpageconstu/' + id, true, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
   }

  getSlots(casId): Observable<FreeSlots[]> {
    return this.ws.get<FreeSlots[]>('/iconsult/freeslots/' + casId, true, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  addbooking(booking) {
    return this.ws.post<any>(this.addBookingUrl,  {
      body: booking,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
    }

  getstaffname(casid: string): Observable<StaffName[]> {
        return this.ws.get<StaffName[]>('/iconsult/getusername/' + casid, true, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  /**
   * POST Method: add student cancel booked slots.
   */
  cancelbookedslot(cancelbookedslots) {
    return this.ws.post<any>(this.updatebookedsloturl,  {
      body: cancelbookedslots,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

  verifyduplicateslotsfun(usefuldata: string): Observable<DepName[]> {
    return this.ws.get<DepName[]>('/iconsult/verifyduplicateslot/' + usefuldata, true, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
      },
    });
  }

}
