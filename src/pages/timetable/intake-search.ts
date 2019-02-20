import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, ViewController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import {
  debounceTime, distinctUntilChanged, filter, map, share, switchMap, tap,
} from 'rxjs/operators';

import { Timetable } from '../../interfaces';
import { IntakeListingProvider, TimetableProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-intake-search',
  templateUrl: 'intake-search.html',
})
export class IntakeSearchPage {

  @ViewChild('autofocus') autofocus;

  searchControl = new FormControl();
  searchIntake$: Observable<string[]>;
  searching: boolean;

  constructor(public viewCtrl: ViewController, private il: IntakeListingProvider) { }

  ionViewDidLoad() {
    const intake$ = this.il.get().pipe(
      map(ii => ii.map(i => i.INTAKE_CODE.toUpperCase()).sort()),
      share(),
    );

    this.searchIntake$ = this.searchControl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      map(term => term.toUpperCase()),
      switchMap(term => intake$.pipe(
        // start filter on input but accept empty input too
        map(intakes => term.length !== 0
          ? intakes.filter(intake => intake.indexOf(term) !== -1)
          : intakes),
        // auto-select if there is only one intake left
        tap(intakes => intakes.length === 1 && this.select(intakes[0])),
      )),
      tap(() => this.searching = false),
    );

    setTimeout(() => this.autofocus.setFocus(), 150);
  }

  select(intake: string) {
    this.viewCtrl.dismiss({ intake });
  }

}
