import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'quick-access-item',
  templateUrl: './quick-access-item.component.html',
  styleUrls: ['./quick-access-item.component.scss']
})
export class QuickAccessItemComponent {
  @Input() icon: string;
  @Input() titleFirstWord: string;
  @Input() titleSecondWord: boolean;
  @Input() observable$: Observable<any>;
  @Input() outputMode: 'currency' | 'percentage';

  constructor() { }

}
