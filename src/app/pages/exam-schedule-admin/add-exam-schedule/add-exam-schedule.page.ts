import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-exam-schedule',
  templateUrl: './add-exam-schedule.page.html',
  styleUrls: ['./add-exam-schedule.page.scss'],
})
export class AddExamSchedulePage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
