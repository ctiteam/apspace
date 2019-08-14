import {
  AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, Input, OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Observable, concat, of } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements AfterViewInit, OnInit {

  @ViewChild(IonSearchbar, { static: true }) searchbar;

  /** Items to be searched or filtered. */
  @Input() items: string[] = [];

  /** Displayed items before searching. */
  @Input() defaultItems: string[] = [];

  /** Message to display when no items. */
  @Input() notFound = 'Type to search';

  searchControl = new FormControl();
  searchItem$: Observable<string[]>;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    // convert all items to be searched to uppercase
    const searchItems = Array.from(new Set(this.items.map(item => item.toUpperCase()))).sort();

    // observable to process inputs when value changes
    const searchChange$ = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      map(term => this.search(searchItems, term)),
    );

    // continue default observable with searched result
    this.searchItem$ = concat(of(this.defaultItems), searchChange$);
  }

  ngAfterViewInit() {
    // XXX: Why Ionic?
    setTimeout(() => this.searchbar.setFocus(), 200);
  }

  select(item: string) {
    this.modalCtrl.dismiss({ item });
  }

  search(items: string[], term: string): string[] {
    // start filter on input but accept EMPTY input too
    const filteredItems = term.length !== 0
      ? items.filter(item => item.indexOf(term) !== -1)
      : items;
    // auto-select if there is only one item left
    if (filteredItems.length === 1) {
      this.select(filteredItems[0]);
    }
    return filteredItems;
  }

}
