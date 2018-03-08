import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/finally';
import { Storage } from '@ionic/storage';

const tgtAPI: string = "https://cas.apiit.edu.my/cas/v1/tickets/";
const serviceAPI: string = 'https://cas.apiit.edu.my';
const validateAPI: string = 'https://cas.apiit.edu.my/cas/serviceValidate?ticket=';


@Injectable()
export class AuthServiceProvider {

  supplied_username;
  tgt: string;
  serviceTicket;

  constructor(
    public http: Http,
    public storage: Storage) {

  }

  async authenticate(username, password) {
    let tgtUrl = await this.getTgtUrl(username, password)
    await this.storage.set('tgtUrl', tgtUrl);
    let tgt = await this.getTgt(tgtUrl)
    console.log(tgt)
    await this.storage.set('tgt', tgt);
    let serviceTicket = await this.getServiceTicket(serviceAPI, tgt)
    console.log(serviceTicket)
    let validateResult = await this.validateServiceTicket(serviceTicket)
    console.log(validateResult)
    return validateResult;
  }

  async getTgtUrl(username, password) {
    this.supplied_username = username;
    let requestBody = this.prepareBody(username, password);
    let options = this.createOptions();
    let response = await this.http.post(tgtAPI, requestBody,
      options).toPromise();
    console.log(response.status);
    return response.text().split("=")[1].split("\"")[1];
  }

  prepareBody(username, password) {
    return 'username=' + username + '&password=' + password;
  }

  createOptions() {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });
    return options;
  }


  getTgt(tokenUrl: string) {
    let values = tokenUrl.split('/');
    let tgt = values[values.length - 1];
    return tgt
  }

  async getServiceTicket(serviceUrl, tgt) {
    let body = 'service=' + serviceUrl;
    let options = this.createOptions();
    let response = await this.http.post(tgtAPI + tgt, body, options).toPromise();
   
    return response.text()
  }

  async validateServiceTicket(serviceTicket) {
    let url = validateAPI + serviceTicket + '&service=' + serviceAPI +'&format=json'
    let test = await this.http.get(url).toPromise();
    return (test.json().serviceResponse.authenticationSuccess.user==this.supplied_username);
  }

}
