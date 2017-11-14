import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the TimetableProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TimetableProvider {

  constructor(public http: Http) {
    console.log('Hello TimetableProvider Provider');
  }

  getTimetable(){
    return this.http.get('https://ws.apiit.edu.my/web-services/index.php/open/weektimetable')
    .map(res => res.json());
  }

}
