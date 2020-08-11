import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { version } from '../../../../package.json';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  version = version;

  constructor(
    private router: Router
  ) { }


  ngOnInit() {
  }

  comingFromTabs() {
    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;
  }
}
