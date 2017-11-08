import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable} from 'rxjs/Observable';

/*
  Generated class for the TimetableDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TimetableDataProvider {

  private path: string  = "https://ws.apiit.edu.my/web-services/index.php/open/weektimetable";
  //private tuePath: string  = "assets/database/tuesday-data.json";  
 // private wedPath: string  = "assets/database/wednesday-data.json";  
 // private thurPath: string  = "assets/database/thursday-data.json";  
//  private friPath: string  = "assets/database/friday-data.json";  


  constructor(public http: Http) {
    console.log('Hello TimetableDataProvider Provider');
  }

  getTimeTableData(){
    return this.http.get(this.path)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError)
  } 
/*
  getTimeTableDataTue(){
    return this.http.get(this.tuePath)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError)
  } 
  getTimeTableDataWed(){
    return this.http.get(this.wedPath)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError)
  } 
  getTimeTableDataThur(){
    return this.http.get(this.thurPath)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError)
  } 
  getTimeTableDataFri(){
    return this.http.get(this.friPath)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError)
  } 
  */

  private catchError(error: Response | any){
    console.log(error);
    return Observable.throw(error.json().error || "Server Error");
  }

  private logResponse( res: Response) {
    console.log(res);
  }

  private extractData(res: Response){
    return res.json();
  }

  
}
 