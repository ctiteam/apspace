import { Component, OnInit } from '@angular/core';
import { WsApiService } from 'src/app/services';
import { Observable, forkJoin } from 'rxjs';
import { QuixCustomer, CustomerDepartment } from 'src/app/interfaces/quix';
import { MenuController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-operation-hours',
  templateUrl: './operation-hours.page.html',
  styleUrls: ['./operation-hours.page.scss'],

})
export class OperationHoursPage implements OnInit {
  quixCustomers$: Observable<QuixCustomer[]>;
  filteredQuixCustomers$: any;


  constructor(
    private ws: WsApiService,
    private menu: MenuController,
  ) { }

  ngOnInit() {
    this.getCompany();
  }
  getCompany() {
    const header = new HttpHeaders({ 'X-Filename': 'quix-customers' });
    return this.quixCustomers$ = this.ws.get<QuixCustomer[]>('/quix/get/file', true, {
      headers: header,
      auth: false
    });
  }
}


