import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';





@Component({
  selector: 'page-r-esults',
  templateUrl: 'r-esults.html',
  providers: []
})
export class RESULTSPage {


  service: any;
  service2:any;

  seg = '{{this.respond4[0].INTAKE_CODE}}';

  serviceTicket4: any;
  serviceTicket5: any;
  respond: any;
  ticket: any;

  constructor(public navCtrl: NavController, public http: Http, public storage: Storage) {
  this.getTGTvalue();
    
  }

  getTGTvalue() {
    console.log("in constructor");
    this.storage.get('tgturl').then((val) => {
      this.ticket = val;
      this.getServiceTicket();
    });
  }



  //send tgt to get service ticket
  getServiceTicket() {
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service = 'service=https://ws.apiit.edu.my/web-services/index.php/student/courses';
    this.http.post(this.ticket, this.service, options)
      .subscribe(res => {
        this.serviceTicket4 = res.text();
        this.getIntakes();
        console.log("Service Ticket 4: " + this.serviceTicket4);
      }, error => {
        console.log("Error to get Service Ticket: " + error);
      })
  }

  respond4: any;

  getIntakes() {
    var url1 = "https://ws.apiit.edu.my/web-services/index.php/student/courses?ticket=" + this.serviceTicket4;
    var headers = new Headers();
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    this.http.get(url1, options)
      .subscribe(ress => {
        this.respond4 = ress.json();
        this.getServiceTicketForResults();
        console.log("this is what we get    :" + this.respond4[0].INTAKE_CODE);
      }, error => {
        console.log('Error message' + error);
      })
  }



  getServiceTicketForResults() {
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service2 = 'service=https://ws.apiit.edu.my/web-services/index.php/student/subcourses?format=json&id=' + this.respond4[0].STUDENT_NUMBER + '&intake='+this.respond4[0].INTAKE_CODE;
    this.http.post(this.ticket, this.service2, options)
      .subscribe(res => {
        this.serviceTicket5 = res.text();
        this.getResults();
        console.log("Service Ticket 5: " + this.serviceTicket5);
      }, error => {
        console.log("Error to get Service Ticket: " + error);
      })
  }

  respond5: any;
  
    getResults() {
      var url2 = "https://ws.apiit.edu.my/web-services/index.php/student/subcourses?format=json&id=" + this.respond4[0].STUDENT_NUMBER + '&intake='+this.respond4[0].INTAKE_CODE + '&ticket='+ this.serviceTicket5;
      var headers = new Headers();
      let options = new RequestOptions({ headers: headers, withCredentials: true });
  
      this.http.get(url2, options)
        .subscribe(ress => {
          this.respond5 = ress.json();
          console.log("this is what we get as a result    :" + this.respond5[0]);
        }, error => {
          console.log('Error message' + error);
        })
    }
  


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  getItems(type: any) {
    return this.respond4[type];
}
}
