import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DashboardCardComponentConfigurations } from 'src/app/interfaces';

@Component({
  selector: 'dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {
  cardConfigurations: DashboardCardComponentConfigurations;
  @Input() withOptionsButton?: boolean;
  @Input() options?: {}[];
  @Input() cardTitle?: string;
  @Input() contentPadding?: boolean;
  @Input() cardSubtitle: string;
  @Input() cardSubtitleColor ? = '';
  constructor(
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.cardConfigurations = {
      withOptionsButton: this.withOptionsButton,
      options: this.options,
      cardTitle: this.cardTitle,
      contentPadding: this.contentPadding,
      cardSubtitle: this.cardSubtitle
    };
  }

}
