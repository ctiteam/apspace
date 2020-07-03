import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import Fuse from 'fuse.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Role } from '../../interfaces';
import { CasTicketService, SettingsService } from '../../services';
import { menus } from './menu';
import { MenuID, MenuItem } from './menu.interface';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss']
})
export class MorePage implements OnInit {
  view$: Observable<'list' | 'cards'>;
  fav$: Observable<MenuItem[]>; // favourite items
  editMode = false;
  term = '';

  options: Fuse.IFuseOptions<MenuItem> = {
    keys: ['title', 'tags']
  };

  menuFiltered = [] as MenuItem[];

  menuFull: MenuItem[] = menus;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public iab: InAppBrowser,
    private cas: CasTicketService,
    private settings: SettingsService,
    private storage: Storage,
    private network: Network,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // assert no duplicate id (probably not able to be done during compile time)
    this.menuFull.forEach((menu, _i, arr) => {
      if (arr.find(m => m.id === menu.id) !== menu) {
        console.warn(`duplicate '${menu.id}' in menuFull`);
      }
    });

    this.view$ = this.settings.get$('menuUI');

    Promise.all([
      this.storage.get('role'),
      this.storage.get('canAccessResults')
    ]).then(([role, canAccessResults = false]: [Role, boolean]) => {
      this.menuFiltered = this.menuFull.filter(
        // tslint:disable-next-line:no-bitwise
        menu => (menu.role & role) && ((menu.canAccess && menu.canAccess === canAccessResults) || !menu.canAccess)
      );

      this.fav$ = this.settings.get$('favoriteItems').pipe(
        // tslint:disable-next-line:no-bitwise
        map(favs => favs.map(fav => this.menuFull.find(menu => menu.id === fav && menu.role & role))
          .filter(menu => menu !== undefined)),
      );
    });
  }

  /** Open page, manually check for third party pages. */
  openPage(url: string, attachTicket = false) {
    // external pages does not use relative or absolute link
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Manually exclude sites that do not need service ticket
      if (!attachTicket) {
        this.iab.create(url, '_system', 'location=true');
      } else {
        if (this.network.type !== 'none') {
          this.cas.getST(url).subscribe(st => {
            this.iab.create(`${url}?ticket=${st}`, '_system', 'location=true');
          });
        } else {
          this.presentToast('External links cannot be opened in offline mode. Please ensure you have a network connection and try again');
        }

      }
    } else {
      url !== 'logout' ? this.navCtrl.navigateForward([url]) : this.logout();
    }
  }

  logout() {
    this.alertCtrl.create({
      header: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Log Out',
          cssClass: 'alert-logout',
          handler: () => {
            this.navCtrl.navigateForward('/logout');
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(alert => alert.present());
  }

  /** No sorting for KeyValuePipe. */
  noop(): number {
    return 0;
  }

  addToFav(id: MenuID) {
    const fav = this.settings.get('favoriteItems');
    const i = fav.indexOf(id);
    if (i !== -1) {
      this.settings.set('favoriteItems', [...fav.slice(0, i), ...fav.slice(i + 1)]);
    } else {
      this.settings.set('favoriteItems', [...fav, id]);
    }
  }

  enableEditMode() {
    this.editMode = !this.editMode;
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: 'danger',
      duration: 6000,
      position: 'top',
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ],
    });
    toast.present();
  }

}
