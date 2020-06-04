import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  @Input() inputControl?: FormControl;

  @Input() items = [];

  @Input() displayLimit = 10;

  searchControl = new FormControl();
  searchItems$: Observable<string[]>;
  searchItems = [];

  displayList = false;

  constructor() { }

  ngOnInit() {
    if (this.inputControl) {
      this.formControlBasedFiltering();
    }
  }

  ngModelBasedFiltering(term) {
    const filteredItems = this.search(this.items, term);
    this.searchItems = filteredItems.slice(0, this.displayLimit);
    if (!this.displayList) {
      this.displayList = !this.displayList;
    }
  }

  formControlBasedFiltering() {
    const searchChange$ = this.inputControl.valueChanges.pipe(
      distinctUntilChanged()
    );

    const searchResult$ = searchChange$.pipe(
      map(term => this.search(this.items, term))
    );

    this.searchItems$ = searchResult$.pipe(
      map(items => items.slice(0, this.displayLimit)),
      tap(_ => { if (!this.displayList) { this.displayList = !this.displayList; }})
    );
  }

  select(item) {
    this.inputControl ? this.inputControl.patchValue(item) : this.inputModelChange.emit(item);
    this.displayList = !this.displayList;
  }

  search(items: string[], term: string): string[] {
    const filteredItems = term.length !== 0
      ? items.filter(item => item.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      : [];
    return filteredItems;
  }
}
