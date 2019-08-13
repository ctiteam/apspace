import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { SettingsService } from '../../services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    public router: Router,
    public storage: Storage,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    this.settings.clear();
    this.storage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
