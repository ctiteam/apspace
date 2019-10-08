import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

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
  @Input() pageName: string;

  constructor(private navCtrl: NavController) { }

  openPage(pageName: string) {
    this.navCtrl.navigateForward(pageName);
  }
}
