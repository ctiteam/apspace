import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';

import { CasTicketService } from './../../services/cas-ticket.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage {

  kbUrl = 'http://kb.sites.apiit.edu.my/home/';
  formsApplicationUrl = 'http://forms.sites.apiit.edu.my/home/';
  kohaUrl = 'http://opac.apiit.edu.my/cgi-bin/koha/opac-user.pl';
  lmsUrl = 'https://lms2.apiit.edu.my/login/index.php';
  webmailUrl = 'https://outlook.office.com/owa/?realm=mail.apu.edu.my';

  constructor(
    private cas: CasTicketService,
    private iab: InAppBrowser,
    private navCtrl: NavController,
  ) { }

  openExternalPage(pageUrl: string, auth = true) {
    if (auth) {
      this.cas.getST(this.kbUrl).subscribe(st => {
        this.iab.create(`${pageUrl}?ticket=${st}`, '_blank', 'location=true')
      });
    } else {
      this.iab.create(`${pageUrl}`, '_blank', 'location=true');
    }
  }
}
