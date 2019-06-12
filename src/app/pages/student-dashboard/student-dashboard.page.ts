import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActionSheet } from '@ionic-native/action-sheet/ngx';
import {
  ActionSheetController, IonRefresher, ModalController, NavController, Platform,
} from '@ionic/angular';



@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.page.html',
  styleUrls: ['./student-dashboard.page.scss'],
})
export class StudentDashboardPage implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
    
  }
}
