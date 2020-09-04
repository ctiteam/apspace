import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { OnLeaveOnMyCluster, PendingApproval, StaffDirectory, StaffProfile } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';
import { PrintPayslipModalPage } from './print-payslip-modal/print-payslip-modal.page';
@Component({
  selector: 'app-hr',
  templateUrl: './hr.page.html',
  styleUrls: ['./hr.page.scss'],
})
export class HrPage implements OnInit {
  // temporary limiting some user for accessing payslip
  showPaySlip = false;
  chosenOnes = [
    'kohyuanyi',
    'melissa.chow',
    'kubashni.sumarian',
    'tehcj',
    'norasyikin.a',
    'wendy.tham',
    'reza.ganji',
    'mohamad.alghayeb',
    'pardeep',
    'param',
    'we.yuan',
    'md.fazla'
  ];

  // leaves$: Observable<LeaveBalance[]>;
  history$: any;
  leaveInCluster$: any;
  pendingApproval$: Observable<PendingApproval[]>;
  skeletons = new Array(4);
  staffsOnLeave = []; // IDs of all staff on leave
  constructor(public modalCtrl: ModalController, private ws: WsApiService, private iab: InAppBrowser) { }

  ngOnInit() {
    this.ws.get<StaffProfile[]>('/staff/profile', { caching: 'cache-only' }).pipe(
      tap(profile => this.showPaySlip = this.chosenOnes.includes(profile[0].ID))
    ).subscribe();
    this.history$ = this.getHistory();
    this.leaveInCluster$ = this.getOnLeaveInMyCluster();
    this.pendingApproval$ = this.getPendingMyApproval();
  }

  getHistory() {
    return this.ws.get('/staff/leave_status').pipe(
      map((res: []) => {
        const results = this.sortArrayOfDateKey(res, 'LEAVE_DATE', 'desc').reduce((previous: any, current: any) => {
          if (!previous[format(new Date(current.LEAVE_DATE), 'MMMM yyyy')]) {
            previous[format(new Date(current.LEAVE_DATE), 'MMMM yyyy')] = [current];
          } else {
            previous[format(new Date(current.LEAVE_DATE), 'MMMM yyyy')].push(current);
          }
          return previous;
        }, {});
        return Object.keys(results).map(date => ({ date, value: results[date] }));
      })
    );
  }

  getPendingMyApproval() {
    return this.ws.get<PendingApproval[]>('/staff/pending_approval').pipe(
      map((res: []) => this.sortArrayOfDateKey(res, 'LEAVEDATE', 'asc'))
    );
  }

  getOnLeaveInMyCluster() {
    return this.ws.get<OnLeaveOnMyCluster[]>('/staff/leave_in_cluster').pipe(
      tap(res => {
        if (res.length > 0) {
          res.forEach(staffOnLeave => {
            this.staffsOnLeave.push(staffOnLeave);
          });
        }
      }),
      map(_ => {
        this.ws.get<StaffDirectory[]>(`/staff/listing`, { caching: 'cache-only' }).subscribe(
          {
            next: (staffDirResponse: StaffDirectory[]) => {
              this.staffsOnLeave.forEach(staffOnLeave => {
                const searchResult = staffDirResponse.filter(staff => staff.ID === staffOnLeave.ID)[0];
                staffOnLeave.PHOTO = searchResult.PHOTO;
                staffOnLeave.EMAIL = searchResult.EMAIL;
              });
            }
          }
        );
        return this.sortArrayOfDateKey(this.staffsOnLeave, 'LEAVEDATE', 'asc');
      },
      ),
      map(res => {
        const results = res
          .reduce((previous: any, current: any) => {
            if (!previous[current.LEAVEDATE]) {
              previous[current.LEAVEDATE] = [current];
            } else {
              previous[current.LEAVEDATE].push(current);
            }
            return previous;
          }, {});
        return Object.keys(results).map(date => ({ date, value: results[date] }));
      })
    );
  }

  sortArrayOfDateKey(array: any[], key: string, sortType: 'asc' | 'desc') {
    return array.sort((a: any, b: any) => {
      if (new Date(a[key]) > new Date(b[key])) {
        return sortType === 'asc' ? 1 : -1;
      }
      if (new Date(a[key]) < new Date(b[key])) {
        return sortType === 'asc' ? -1 : 1;
      }
      return 0;
    }
    );
  }

  openHrSystem() {
    this.iab.create('https://hr.apiit.edu.my', '_system', 'location=true');
  }

  openPayslipPdf() {
    this.modalCtrl.create({
      component: PrintPayslipModalPage,
      cssClass: 'custom-modal-style',
    }).then(modal => {
      modal.present();
      modal.onDidDismiss();
    });
  }
}
