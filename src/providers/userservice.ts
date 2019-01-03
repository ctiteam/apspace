import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserserviceProvider {

  userurl = 'http://127.0.0.1:5000/user';

  constructor(public http: HttpClient) {
  }

  getallusers(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:5000/user').do(res => console.log(res));
  }

}
