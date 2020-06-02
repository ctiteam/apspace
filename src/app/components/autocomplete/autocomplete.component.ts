import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
  @Input() title?: string;

  @Input() inputModel: string;
  @Output() inputModelChange = new EventEmitter<string>();

  @Input() formControl?: FormControl;

  @Input() items = [];

  @Input() displayLimit = 10;

  searchControl = new FormControl();
  searchItems$: Observable<string[]>;
  searchItems = [];

  displayList = false;

  constructor() { }

  ngOnInit() {
    if (this.formControl) {
      this.formControlBasedFiltering();
    }
  }

  ngModelBasedFiltering() {
    this.searchItems = this.search(this.items, this.inputModel);
  }

  formControlBasedFiltering() {
    const searchChange$ = this.formControl.valueChanges.pipe(distinctUntilChanged());

    const searchResult$ = searchChange$.pipe(
      map(term => this.search(this.items, term))
    );

    this.searchItems$ = searchResult$.pipe(
      map(items => items.slice(0, this.displayLimit)),
      tap(_ => { if (!this.displayList) { this.displayList = !this.displayList; }})
    );
  }

  select(item) {
    this.formControl.patchValue(item);
    this.displayList = !this.displayList;
  }

  search(items: string[], term: string): string[] {
    // start filter on input but accept EMPTY input too
    const filteredItems = term.length !== 0
      ? items.filter(item => item.indexOf(term) !== -1)
      : items;
    return filteredItems;
  }
}
