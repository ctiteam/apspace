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
    this.INTAKES$ = this.ws.get<Courses[]>('/student/courses')
    .do(res =>{
      this.getSubcourses(res[0].STUDENT_NUMBER, res[0].INTAKE_CODE)
    })
  }

  getSubcourses(student_id, intake_code ){
    let params = { format: 'json', id: student_id, intake: intake_code };
    this.COURSES$ = this.ws.get<Subcourses[]>('/student/subcourses', true, { params: params });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
