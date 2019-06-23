import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {
  @Input() cardTitle: string;
  @Input() cardSubtitle: string;
  @Input() withOptionsButton: boolean;
  @Input() options: {
    title: string,
    icon: string,
    callbackFunction : Function
  }[];
  constructor(
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  async showOptionsMenu(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      componentProps:{title: 'Options',options:this.options},
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}
