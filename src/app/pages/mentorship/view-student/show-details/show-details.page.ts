import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MentorshipAttendance, MentorshipResult } from 'src/app/interfaces/mentorship';
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

  attendance$: Observable<MentorshipAttendance[]>;
  result$: Observable<MentorshipResult[]>;
  selectedSegment = 'result';

  constructor(
    private mentorship: MentorshipService,
    private modalCtrl: ModalController
  ) { }

  ionViewDidEnter() {
    this.attendance$ = this.mentorship.getAttendance(this.tp, this.module, this.intake).pipe(
      tap(r => r.sort((a, b) => new Date(b.CLASS_DATE).getTime() - new Date(a.CLASS_DATE).getTime()))
    );

    this.result$ = this.mentorship.getSubcourseAssessment(this.tp, this.intake, this.module).pipe(
      tap(r => r.sort((a, b) => new Date(b.EXAM_DATE).getTime() - new Date(a.EXAM_DATE).getTime()))
    );
  }

  segmentChanged(value: string) {
    this.selectedSegment = value;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
