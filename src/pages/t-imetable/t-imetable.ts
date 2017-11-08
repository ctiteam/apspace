import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TimetableDataProvider } from '../../providers/timetable-data/timetable-data'

@Component({
  selector: 'page-t-imetable',
  templateUrl: 't-imetable.html',
  providers: [TimetableDataProvider]
})
export class TIMETABLEPage {

  segments: string = "mon"

  dataList = [];
  tueList = [];
  wedList = [];
  thurList = [];
  friList = [];

  constructor(public navCtrl: NavController, private timetabledataProvider: TimetableDataProvider) {
    this.getTimeTableData();
    /* this.getTimeTableDataTue();
    this.getTimeTableDataWed();
    this.getTimeTableDataThur();
    this.getTimeTableDataFri(); */
  }

  getTimeTableData(){
    this.timetabledataProvider.getTimeTableData().subscribe(data  => this.dataList = data);

  }
  /*
  getTimeTableDataTue(){
    this.timetabledataProvider.getTimeTableDataTue().subscribe(data  => this.tueList = data);

  }
  getTimeTableDataWed(){
    this.timetabledataProvider.getTimeTableDataWed().subscribe(data  => this.wedList = data);
  }
  getTimeTableDataThur(){
    this.timetabledataProvider.getTimeTableDataThur().subscribe(data  => this.thurList = data);
  }
  getTimeTableDataFri(){
    this.timetabledataProvider.getTimeTableDataFri().subscribe(data  => this.friList = data);
  }
  */


 }
