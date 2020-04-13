import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateMonthImg'
})
export class GenerateMonthImgPipe implements PipeTransform {

  transform(value: string): string {
    const keyImage = {
      ['Jan']: 'assets/img/google_calendar_wall/bkg_01_january.jpg',
      ['Feb']: 'assets/img/google_calendar_wall/bkg_02_february.jpg',
      ['Mar']: 'assets/img/google_calendar_wall/bkg_03_march.jpg',
      ['Apr']: 'assets/img/google_calendar_wall/bkg_04_april.jpg',
      ['May']: 'assets/img/google_calendar_wall/bkg_05_may.jpg',
      ['Jun']: 'assets/img/google_calendar_wall/bkg_06_june.jpg',
      ['Jul']: 'assets/img/google_calendar_wall/bkg_07_july.jpg',
      ['Aug']: 'assets/img/google_calendar_wall/bkg_08_august.jpg',
      ['Sep']: 'assets/img/google_calendar_wall/bkg_09_september.jpg',
      ['Oct']: 'assets/img/google_calendar_wall/bkg_10_october.jpg',
      ['Nov']: 'assets/img/google_calendar_wall/bkg_11_november.jpg',
      ['Dec']: 'assets/img/google_calendar_wall/bkg_12_december.jpg',
    };

    return keyImage[value];
  }
}
