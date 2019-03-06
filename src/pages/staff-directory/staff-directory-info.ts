import { Component, ElementRef } from '@angular/core';
import { App, IonicPage, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { map, share } from 'rxjs/operators';

import { StaffDirectory } from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage({ segment: 'staff/:id' })
@Component({
  selector: 'page-staff-directory-info',
  templateUrl: 'staff-directory-info.html',
})
export class StaffDirectoryInfoPage {
  imageLoaded = false;
  staff$: Observable<StaffDirectory>;

  constructor(
    public params: NavParams,
    private ws: WsApiProvider,
    public app: App,
    private elRef: ElementRef,
    ) { }

  ionViewDidLoad() {
    this.imageLoaded = false;
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing').pipe(
      map(ss => ss.find(s => this.params.get('id') === s.ID)),
      share(),
    );
  }

  hideImageLoading(){
    const staffPicElRef = this.elRef.nativeElement.querySelector('#staffImg');
    if(staffPicElRef.complete){
      this.imageLoaded = true;
    }
  }

  GoToIconsult(casId: number, EMAIL: string) {
    this.app.getRootNav().push('IconsultPage', { casId, EMAIL });
  }

}
