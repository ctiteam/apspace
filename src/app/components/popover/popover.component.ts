import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {
  options = this.navParams.get('options');
  title = this.navParams.get('title');

  constructor(
    public navParams: NavParams,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    console.log(this.options);
  }

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

}
