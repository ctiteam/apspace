import { Component, OnInit } from '@angular/core';

import { VersionService } from 'src/app/services/version.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  version = this.ver.version;

  constructor(
    private ver: VersionService
  ) { }

  ngOnInit() {
  }
}
