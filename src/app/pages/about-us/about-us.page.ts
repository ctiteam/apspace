import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VersionService } from 'src/app/services/version.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  version = this.ver.version;

  constructor(
    private router: Router,
    private ver: VersionService
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
