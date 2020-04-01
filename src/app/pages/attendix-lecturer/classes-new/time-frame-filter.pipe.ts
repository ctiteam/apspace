import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { AttendixClass } from 'src/app/interfaces';

@Pipe({
  name: 'timeFrameFilter'
})
export class TimeFrameFilterPipe implements PipeTransform {

  transform(classes: AttendixClass[], timeframe: number): any {
    const today = new Date();
    console.log(timeframe);
    return classes.sort((a, b) =>  moment(b.DATE, 'YYYY-MM-DD').toDate().getTime() - moment(a.DATE, 'YYYY-MM-DD').toDate().getTime())
            .filter(c => moment(today).diff(moment(c.DATE, 'YYYY-MM-DD').subtract(), 'days') <= timeframe);
  }

}
