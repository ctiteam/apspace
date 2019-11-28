import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LeaveBalance } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-hr',
  templateUrl: './hr.page.html',
  styleUrls: ['./hr.page.scss'],
})
export class HrPage implements OnInit {
  leaves$: Observable<LeaveBalance[]>;
  history$: any;
  skeletons = new Array(4);
  devUrl = 'https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com/dev';
  summaryChart = {
    type: 'bar',
    options: {
      legend: {
        position: 'right', // place legend on the right side of chart
        display: false
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    },
    data: {}
  };
  highestRatedSliderOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2.3,
    centeredContent: true,
    spaceBetween: 8
  };
  constructor(private ws: WsApiService) { }

  ngOnInit() {
    this.leaves$ = this.ws.get<LeaveBalance[]>('/staff/leave_balance', { url: this.devUrl }).pipe(
      tap(leaves => {
        const labels = [];
        const datasets = [
          {
            label: ['Taken'],
            data: [],
            backgroundColor: '#EBCCD1'
          },
          {
            label: ['Pending'],
            data: [],
            backgroundColor: '#FAEBCC'
          },
          {
            label: ['Available'],
            data: [],
            backgroundColor: '#D6E9C6'

          }
        ];
        leaves.forEach(leave => {
          const matches = leave.LEAVE_TYPE.match(/\b(\w)/g); // Get first letter from each word. Example: ['A', 'L'] for Annual Leave
          const acronym = matches.join('').slice(0, 2); // Join letters together and take first two only. Example: AL
          if (!labels.includes(acronym)) { // TEMP UNTIL THE BACKEND IS FIXED
            labels.push(acronym);
            datasets[0].data.push(+leave.TAKEN + 10); // adding data for testing
            datasets[1].data.push(+leave.PENDING + 20); // adding data for testing
            datasets[2].data.push(+leave.AVAILABLE); // adding data for testing
          }
          leave.LEAVE_ACRONYM = acronym; // add the acronym to the list
          leave.LEAVE_TYPE_COLOR = this.strToColor(leave.LEAVE_TYPE); // add color to the list
        });

        this.summaryChart.data = {
          labels,
          datasets
        };
      })
    );
    this.history$ = this.ws.get('/staff/leave_status', { url: this.devUrl });
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
}
