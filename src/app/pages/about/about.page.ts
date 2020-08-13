import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { VersionService } from 'src/app/services/version.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {

  version = this.ver.version;
  year = new Date().getFullYear();

  constructor(
    public aib: InAppBrowser,
    private ver: VersionService
  ) { }

  openUrl(url: string) {
    this.aib.create(url, '_system', 'location=true');
  }
}
