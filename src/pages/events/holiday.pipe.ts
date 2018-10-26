import { Pipe, PipeTransform } from '@angular/core';

/**
 * Reverse array.
 */
@Pipe({ name: 'upcoming' })
export class HolidayPipe implements PipeTransform {
    /**
     * Return a new reversed array.
     *
     * @param holidays - array to be reversed
     */
    transform(holidays: any[] | null): any[] {
        const date = new Date();
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const test = (holidays || []).find(holiday => holiday.holiday_start_date);
        const test2 = (holidays || []).find(holiday => holiday.holiday_start_date.split('-')[0]);
        const ind = date.getMonth() <= (months.indexOf(test));
        const ind2 = date.getDate() <= test2;
        console.log(test);
        if (!ind) {
            if (!ind2) {
                console.log('TRUE');
            } else {
                console.log('FALSE');
            }
        }
        return (holidays || []).find(holiday => holiday.holiday_start_date);
    }
}
