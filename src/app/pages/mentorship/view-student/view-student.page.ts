import { Component } from '@angular/core';
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
  styleUrls: ['./view-student.page.scss']
})
export class ViewStudentPage {
  tp: string;
  selectedIntake: string;
  search: '';

  profile$: Observable<StudentProfile>;
  intake$: Observable<Intake[]>;
  selectedIntake$: Observable<Intake[]>;

  courseDetail$: Observable<CourseDetail[]>;
  subCourse$: Observable<{ index: string; value: any }[]>;
  profileSkeleton = new Array(4);

  allFilters = ['low-attendance'];

  shownFilters: string[];

  constructor(
    private mentorship: MentorshipService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {}

  ionViewDidEnter() {
    this.tp = this.route.snapshot.params.tp;
    this.selectedIntake = this.route.snapshot.params.intake;
    this.profile$ = this.mentorship.getStudentProfile(this.tp);
    this.intake$ = this.mentorship.getIntakes(this.tp);
    this.onTap(this.selectedIntake);

    // Remove the stupid select-icon, select-text
    const ionSelects = document.querySelectorAll('ion-select');
    ionSelects.forEach((select) => {
      const selectIconInner = select.shadowRoot.querySelector('.select-icon');
      const selectTextInner =  select.shadowRoot.querySelector('.select-text');

      if (selectTextInner && selectIconInner) {
        selectIconInner.parentNode.removeChild(selectIconInner);
        selectTextInner.parentNode.removeChild(selectTextInner);
      }
    });
  }

  removeFilter(value: string) {
    this.shownFilters = this.shownFilters.filter(item => item !== value);
  }

  sortResult(results: any) {
    // tslint:disable-next-line: max-line-length
    const dataBySemester = results.reduce(
      (acc: any, result: any) => (
        (acc[result.SEMESTER] = (acc[result.SEMESTER] || []).concat(result)),
        acc
      ),
      {}
    );
    return Object.keys(dataBySemester).map(index => ({
      index,
      value: dataBySemester[index]
    }));
  }

  onTap(intake: string) {
    this.selectedIntake = intake;
    this.courseDetail$ = this.mentorship.getStudentCourse(this.tp, intake);
    this.selectedIntake$ = this.intake$.pipe(
      map(items => items.filter(item => item.INTAKE_CODE === intake))
    );
    this.subCourse$ = this.mentorship
      .getSubcourse(this.tp, intake)
      .pipe(map(r => this.sortResult(r)));
  }

  showDetails(module: string) {
    this.presentModal(module);
  }

  async presentModal(moduleCode: string) {
    const modal = await this.modalCtrl.create({
      component: ShowDetailsPage,
      cssClass: 'add-min-height-width',
      componentProps: {
        intake: this.selectedIntake,
        module: moduleCode,
        tp: this.tp
      }
    });

    return await modal.present();
  }
}
