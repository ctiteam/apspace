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
  seg: string = "lev2";

  serviceTicket: any;
  respond: any;
  ticket: any;
  constructor(public navCtrl: NavController, public http: Http, public storage: Storage) {
    this.getTGTvalue();

  }

  getTGTvalue() {
    this.storage.get('tgturl').then((val) => {
      this.ticket = val;
    });
  }

  getServiceTicket() {
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service = 'service=https://ws.apiit.edu.my/web-services/index.php/student/courses?format=json&callback=__ng_jsonp__.__req3.finished';
    this.http.post(this.ticket, this.service, options)
      .subscribe(res => {
        this.serviceTicket = res.text()
        console.log("Service Ticket = " + this.serviceTicket);
        this.validateST();
      })
  }

  validateST() {

    // var validateUrl = 'https://cas.apiit.edu.my/cas/validate';
    // var webService = validateUrl + '?' + this.service + '&ticket=' + this.serviceTicket;
    // this.http.get(webService)
    //   .subscribe(res => {
    //     this.respond = res;
    //     console.log("validate respond is this  :" + this.respond);

    var url = 'https://ws.apiit.edu.my/web-services/index.php/student/courses?';
    var webServiceurl = url + "sticket=" + this.serviceTicket;

    this.http.get(webServiceurl)
      .subscribe(ress => {

        this.respond = ress;
        console.log("this is what we get    :" + this.respond);
      }, error => {

        console.log('Error message' + error);
      })

    // }, error => {
    //   console.log('Error message' + error);
    // })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
