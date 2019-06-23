import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'quick-access-item',
  templateUrl: './quick-access-item.component.html',
  styleUrls: ['./quick-access-item.component.scss']
})
export class QuickAccessItemComponent implements OnInit {
  @Input() icon: string;
  @Input() titleFirstWord: string;
  @Input() titleSecondWord: boolean;
  @Input() value: string;
  constructor() { }

  ngOnInit() {
  }

}
