import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable} from 'rxjs/Observable';


/*
  Generated class for the ResultProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ResultProvider {
  private url: string = "assets/database/result-data.json";
  private path: string = "assets/database/result-data2.json";
  

  constructor(public http: Http) {
    console.log('Hello ResultProvider Provider');
  }
  getResultData(){
    return this.http.get(this.url)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError)
  }

  getResultData2(){
    return this.http.get(this.path)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError)
  }
  
  private catchError(error: Response | any){
    console.log(error);
    return Observable.throw(error.json().error || "Server Error");
  }

  private logResponse(res: Response) {
    console.log(res);
  }

  private extractData(res: Response){
    return res.json();
  }

}
