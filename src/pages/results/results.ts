import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Observable } from 'rxjs/Observable';
import { WsApiProvider } from '../../providers';
import { Courses } from '../../interfaces';
import { Subcourses } from '../../interfaces/subcourses';



@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: []
})

export class ResultsPage {

  INTAKES$: Observable<Courses[]>;
  COURSES$: Observable<Subcourses[]>;
  

  constructor(
    private network: Network,
    private ws: WsApiProvider) {
    
  }

  ionViewDidLoad() {
   this.getIntakes();
  }



  getIntakes() {
    this.INTAKES$ = this.ws.get<Courses[]>('/student/courses')
    .do(res =>{this.getSubcourses(res)})
  }

  getSubcourses(res){    
    let params = { format: 'json', id: res[0].STUDENT_NUMBER, intake: res[0].INTAKE_CODE };
    this.COURSES$ = this.ws.get<Subcourses[]>('/student/subcourses', false, { params: params });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
