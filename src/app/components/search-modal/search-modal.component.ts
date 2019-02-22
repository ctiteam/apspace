import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit {

  @Input() items: string[];

  searchControl = new FormControl();
  searchItem$: Observable<string[]>;
  searching: boolean;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const searchItems = Array.from(new Set(this.items.map(item => item.toUpperCase()))).sort();

    this.searchItem$ = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => this.searching = true),
      map(term => this.search(searchItems, term)),
      tap(() => this.searching = false),
    );
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
