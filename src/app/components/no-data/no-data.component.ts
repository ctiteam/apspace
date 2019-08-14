import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent {
  @Input() messageTitle: string;
  @Input() messageContent?: string;
  @Input() buttonContent?: string;
  @Input() buttonAction: () => {};
  constructor(
    // Router is needed to injected here because it is being called from the pages
    private router: Router
  ) { }

}
