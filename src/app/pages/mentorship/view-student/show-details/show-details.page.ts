import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Attendance, Result } from 'src/app/interfaces/mentorship';
import { MentorshipService } from 'src/app/services/mentorship.service';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.page.html',
  styleUrls: ['./show-details.page.scss'],
})
export class ShowDetailsPage {

  @Input() intake: string;
  @Input() module: string;
  @Input() tp: string;

  attendance$: Observable<Attendance[]>;
  result$: Observable<Result[]>;
  selectedSegment = 'attendance';

  constructor(
    private mentorship: MentorshipService,
    private modalCtrl: ModalController
  ) { }

  ionViewDidEnter() {
    this.attendance$ = this.mentorship.getAttendance(this.tp, this.module, this.intake);
    this.result$ = this.mentorship.getSubcourseAssessment(this.tp, this.module);
  }

  segmentChanged(value: string) {
    this.selectedSegment = value;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
