import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { Sqa } from '../../interfaces';
import { SqaProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-password-recovery',
  templateUrl: 'password-recovery.html',
})
export class PasswordRecoveryPage {

  qa = {} as Sqa;
  editMode = false;
  isLoading = false;

  constructor(private sqa: SqaProvider) { }

  ionViewDidLoad() {
    this.getConfig();
  }

  onEdit() {
    this.editMode = true;
  }

  getConfig() {
    this.isLoading = true;
    this.sqa.get().pipe( finalize(() => this.isLoading = false) )
      .subscribe(qa => this.qa = qa);
  }

  setConfig(v: Sqa) {
    this.sqa.set(v).subscribe();
    this.editMode = false;
  }

}
