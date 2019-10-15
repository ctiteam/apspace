import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentProfile } from 'src/app/interfaces';
import { CourseDetail, Intake } from 'src/app/interfaces/mentorship';
import { MentorshipService } from 'src/app/services/mentorship.service';
import { ShowDetailsPage } from './show-details/show-details.page';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.page.html',
  styleUrls: ['./view-student.page.scss'],
})
export class ViewStudentPage implements OnInit {

  // Global var for TP & Intake
  tp: string;
  intake: string;

  profile$: Observable<StudentProfile>;
  intake$: Observable<Intake[]>;
  selectedIntake$: Observable<Intake[]>;

  courseDetail$: Observable<CourseDetail[]>;
  subCourse$: Observable<any>;

  constructor(
    private mentorship: MentorshipService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.tp = this.route.snapshot.params.tp;
    this.intake = this.route.snapshot.params.intake;

    this.profile$ = this.mentorship.getStudentProfile(this.tp);
    this.intake$ = this.mentorship.getIntakes(this.tp);

    this.onTap(this.intake);
  }

  sortResult(results: any) {
    const dataBySemester = results
      .reduce((previous: any, current: any) => {
        if (!previous[current.SEMESTER]) {
          previous[current.SEMESTER] = [current];
        } else {
          previous[current.SEMESTER].push(current);
        }
        return previous;
      }, {});

    return Object.keys(dataBySemester).map(index => ({ index, value: dataBySemester[index] }));
  }

  onTap(intake: string) {
    this.intake = intake;
    this.courseDetail$ = this.mentorship.getStudentCourse(this.tp, intake);
    this.selectedIntake$ = this.intake$.pipe(map(items => items.filter(item => item.INTAKE_CODE === intake)));
    this.subCourse$ = this.mentorship.getSubcourse(this.tp, intake).pipe(map(r => this.sortResult(r)));
  }

  showDetails(module: string) {
    this.presentModal(module);
  }

  async presentModal(moduleCode: string) {
    const modal = await this.modalCtrl.create({
      component: ShowDetailsPage,
      cssClass: 'add-min-height-width',
      componentProps: {
        intake: this.intake,
        module: moduleCode,
        tp: this.tp
      }
    });

    return await modal.present();
  }

}
