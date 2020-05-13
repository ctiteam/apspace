import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-manage-assessment-types',
  templateUrl: './manage-assessment-types.page.html',
  styleUrls: ['./manage-assessment-types.page.scss'],
})
export class ManageAssessmentTypesPage implements OnInit {
  onEdit = false;
  assessmentTypeIndex;

  assessmentTypes = [
    'Lorem Ipsum 1',
    'Lorem Ipsum 2',
    'Lorem Ipsum 3',
    'Lorem Ipsum 4',
    'Lorem Ipsum 5',
    'Lorem Ipsum 6',
    'Lorem Ipsum 7',
    'Lorem Ipsum 8',
    'Lorem Ipsum 9'
  ];

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  toggleEdit(i) {
    this.onEdit = !this.onEdit;

    // if (this.onEdit) {
    this.assessmentTypeIndex = i;
    // }
  }

  closeModal() {
    this.modalCtrl.dismiss(null);
  }

}
