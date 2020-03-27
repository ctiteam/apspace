import {
  AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Observable, concat, of } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements AfterViewInit, OnInit {

  @ViewChild(IonSearchbar, { static: true }) searchbar: IonSearchbar;

  /** Items to be searched or filtered. */
  @Input() items: string[] = [];

  /** Displayed items before searching. If present, pre-search disable. */
  @Input() defaultItems: string[] = [];

  /** Placeholder shown for search bar. */
  @Input() placeholder = 'Search';

  /** Message to display when no items. */
  @Input() notFound = 'Type to search';

  /** Default pre-search term, pre-search if defaultItems unspecified. */
  @Input() defaultTerm = '';

  /** Auto focus input element. Mainly used for testing. */
  @Input() autofocus = true;

  searchControl = new FormControl();
  searchItems$: Observable<string[]>;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    // convert all items to uppercase
    const searchItems = Array.from(new Set(this.items.map(item => item.toUpperCase()))).sort();
    const defaultItems = this.defaultItems.map(item => item.toUpperCase());

    // observable to process inputs when value changes
    let searchChange$ = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
    );

    // default items have higher priority as this is optional
    if (this.defaultTerm) {
      // only pre-search when default items is not specified
      if (this.defaultItems.length === 0) {
        searchChange$ = searchChange$.pipe(startWith(this.defaultTerm.toUpperCase()));
      }
      // set default term in view, handle change event ourselves
      this.searchControl.setValue(this.defaultTerm.toUpperCase(), { emitEvent: false });
    }

    const searchResult$ = searchChange$.pipe(
      map(term => this.search(searchItems, term)),
    );

    // continue default observable with searched result
    this.searchItems$ = concat(of(defaultItems), searchResult$);
  }

  ngAfterViewInit() {
    // XXX: Why Ionic?
    if (this.autofocus) {
      setTimeout(() => this.searchbar.setFocus(), 200);
    }
  }

  select(item: string) {
    this.modalCtrl.dismiss({ item });
  }

  search(items: string[], term: string): string[] {
    // start filter on input but accept EMPTY input too
    const filteredItems = term.length !== 0
      ? items.filter(item => item.indexOf(term) !== -1)
      : items;
    return filteredItems;
  }

}
