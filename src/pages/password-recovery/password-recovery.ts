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

  qa = {} as Sqa;
  editMode = false;
  isLoading = false;

  constructor(private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.getConfig();
  }

  onEdit() {
    this.editMode = true;
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
