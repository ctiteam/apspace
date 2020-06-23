import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
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
  // summaryChart = {
  //   type: 'bar',
  //   options: {
  //     legend: {
  //       position: 'right', // place legend on the right side of chart
  //       display: false
  //     },
  //     scales: {
  //       xAxes: [{
  //         stacked: true
  //       }],
  //       yAxes: [{
  //         stacked: true
  //       }]
  //     }
  //   },
  //   data: {}
  // };
  // highestRatedSliderOpts = {
  //   initialSlide: 0,
  //   speed: 400,
  //   slidesPerView: 2.3,
  //   centeredContent: true,
  //   spaceBetween: 8
  // };
  constructor(public modalCtrl: ModalController, private ws: WsApiService, private iab: InAppBrowser) { }

  ngOnInit() {
    this.ws.get<StaffProfile[]>('/staff/profile', { caching: 'cache-only' }).pipe(
      tap(profile => this.showPaySlip = this.chosenOnes.includes(profile[0].ID)),
      tap(console.log)
    ).subscribe();
    // commented until the backend is fixed
    // this.leaves$ = this.ws.get<LeaveBalance[]>('/staff/leave_balance').pipe(
    //   tap(leaves => {
    //     const labels = [];
    //     const datasets = [
    //       {
    //         label: ['Taken'],
    //         data: [],
    //         backgroundColor: '#EBCCD1'
    //       },
    //       {
    //         label: ['Pending'],
    //         data: [],
    //         backgroundColor: '#FAEBCC'
    //       },
    //       {
    //         label: ['Available'],
    //         data: [],
    //         backgroundColor: '#D6E9C6'

    //       }
    //     ];
    //     leaves.forEach(leave => {
    //       const matches = leave.LEAVE_TYPE.match(/\b(\w)/g); // Get first letter from each word. Example: ['A', 'L'] for Annual Leave
    //       const acronym = matches.join('').slice(0, 2); // Join letters together and take first two only. Example: AL
    //       if (!labels.includes(acronym)) { // TEMP UNTIL THE BACKEND IS FIXED
    //         labels.push(acronym);
    //         datasets[0].data.push(+leave.TAKEN); // adding data for testing
    //         datasets[1].data.push(+leave.PENDING); // adding data for testing
    //         datasets[2].data.push(+leave.AVAILABLE); // adding data for testing
    //       }
    //       leave.LEAVE_ACRONYM = acronym; // add the acronym to the list
    //       leave.LEAVE_TYPE_COLOR = this.strToColor(leave.LEAVE_TYPE); // add color to the list
    //     });

    //     this.summaryChart.data = {
    //       labels,
    //       datasets
    //     };
    //   })
    // );
    this.history$ = this.getHistory();
    this.leaveInCluster$ = this.getOnLeaveInMyCluster();
    this.pendingApproval$ = this.getPendingMyApproval();
  }

  /** Convert string to color with djb2 hash function. */
  strToColor(str: string): string {
    let hash = 5381;
    /* tslint:disable:no-bitwise */
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return '#' + [16, 8, 0].map(i => ('0' + (hash >> i & 0xFF).toString(16))
      .substr(-2)).join('');
    /* tslint:enable:no-bitwise */
  }

  getHistory() {
    return this.ws.get('/staff/leave_status').pipe(
      map((res: []) => {
        const results = this.sortArrayOfDateKey(res, 'LEAVE_DATE', 'desc').reduce((previous: any, current: any) => {
          if (!previous[moment(current.LEAVE_DATE).format('MMMM YYYY')]) {
            previous[moment(current.LEAVE_DATE).format('MMMM YYYY')] = [current];
          } else {
            previous[moment(current.LEAVE_DATE).format('MMMM YYYY')].push(current);
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
      if (moment(a[key]).toDate() > moment(b[key]).toDate()) {
        return sortType === 'asc' ? 1 : -1;
      }
      if (moment(a[key]).toDate() < moment(b[key]).toDate()) {
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
