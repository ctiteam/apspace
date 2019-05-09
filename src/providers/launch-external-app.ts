import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AppAvailability } from '@ionic-native/app-availability';


declare var detectBrowser;

@Injectable()
export class LaunchExternalAppProvider {

    constructor(
        private plt: Platform,
        private iab: InAppBrowser,
        private appAvailability: AppAvailability
    ) { }

    getPlatform(): string {
        let platform: string;
        if (this.plt.platforms().find(ele => ele === 'core')) {
            platform = detectBrowser();
        } else if (this.plt.platforms().find(ele => ele === 'android')) {
            platform = 'Android';
        } else if (this.plt.platforms().find(ele => ele === 'ios')) {
            platform = 'iOS';
        } else if (this.plt.platforms().find(ele => ele === 'windows')) {
            platform = 'Window Mobile';
        } else {
            platform = this.plt.platforms().toString();
        }
        return platform;
    }

    launchExternalApp(iosSchemaName: string, androidPackageName: string, appViewUrl: string, httpUrl: string, playStoreUrl: string, appStoreUrl: string, username: string) {
        // window.location.href = 'msteams://'
        let app: string;
        if (this.getPlatform() == 'iOS') {
            app = iosSchemaName;
        } else if (this.getPlatform() == 'Android') {
            app = androidPackageName;
        } else {
            this.iab.create(httpUrl, '_system');
            return;
        }
        this.appAvailability.check(app).then(
            () => { // success callback
                window.location.href = `${appViewUrl + username}`;
            },
            () => { // error callback
                if (this.getPlatform() == 'Android') {
                    this.iab.create(playStoreUrl, '_system');
                } else if (this.getPlatform() == 'iOS') {
                    this.iab.create(appStoreUrl, '_system');
                }
            }
        );
    }

}