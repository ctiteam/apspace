import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { Sqa } from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-password-recovery',
  templateUrl: 'password-recovery.html',
})
export class PasswordRecoveryPage {
  showEmailNotValidMsg = false;
  qa = {} as Sqa;
  editMode = false;
  isLoading = false;

  // THIS REGULAR EXPERSSION FOLLOWS THE RFC 2822 STANDARD
  emailValidationRegularExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

  constructor(private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.getConfig();
  }

  onEdit() {
    this.editMode = true;
  }

  onchangeEmail(){
    let responseOfRegEx = this.qa.secondaryEmail.match(this.emailValidationRegularExp);
    if(!responseOfRegEx){
      this.showEmailNotValidMsg = true;
    } else{
      this.showEmailNotValidMsg = false;
    }
  }

  getConfig() {
    this.isLoading = true;
    this.ws.get<Sqa>('/sqa/', true)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(qa => this.qa = qa);
  }

  setConfig(v: Sqa) {
    const body = new HttpParams({ fromObject: { ...v }}).toString();
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    this.ws.post('/sqa/', { body, headers }).subscribe();
    this.editMode = false;
  }

}
