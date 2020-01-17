import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
// import { APP_BASE_HREF, PathLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { FCM } from '@ionic-native/fcm/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { NEVER } from 'rxjs';

import { AppComponent } from './app.component';
import { CasTicketService, FeedbackService, NotificationService, UserSettingsService, VersionService } from './services';

describe('AppComponent', () => {
  // let routerSpy: { url: jasmine.Spy };
  let fcmSpy: { onNotification: jasmine.Spy };
  let networkSpy: { type: jasmine.Spy };
  let userSettingsServiceSpy: {
    getUserSettingsFromStorage: jasmine.Spy;
    darkThemeActivated: jasmine.Spy;
    PureDarkThemeActivated: jasmine.Spy;
    getAccentColor: jasmine.Spy;
  };
  let versionServiceSpy: { checkForUpdate: jasmine.Spy };
  let shakeSpy: jasmine.SpyObj<Shake>;

  beforeEach(async(() => {
    // routerSpy = jasmine.createSpyObj('Router', ['url']);
    fcmSpy = jasmine.createSpyObj('FCM', ['onNotification']);
    networkSpy = jasmine.createSpyObj('Network', ['type']);
    shakeSpy = jasmine.createSpyObj('Shake', ['startWatch']);
    userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService',
      ['getUserSettingsFromStorage', 'darkThemeActivated', 'PureDarkThemeActivated', 'getAccentColor']);
    versionServiceSpy = jasmine.createSpyObj('VersionService', ['checkForUpdate']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        // Location,
        // { provide: LocationStrategy, useValue: PathLocationStrategy },
        // { provide: APP_BASE_HREF, useValue: '/' },
        // { provide: Router, useValue: routerSpy },
        Platform,
        { provide: FCM, useValue: fcmSpy },
        { provide: ModalController, useValue: {} },
        { provide: Network, useValue: networkSpy },
        { provide: NotificationService, useValue: {} },
        { provide: CasTicketService, useValue: {} },
        { provide: FeedbackService, useValue: {} },
        { provide: PopoverController, useValue: {} },
        { provide: Storage, useValue: {} },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: VersionService, useValue: versionServiceSpy },
        { provide: Shake, useValue: shakeSpy },
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    fcmSpy.onNotification.and.returnValue(NEVER);
    networkSpy.type.and.returnValue('wifi');
    userSettingsServiceSpy.darkThemeActivated.and.callFake(() => NEVER);
    userSettingsServiceSpy.PureDarkThemeActivated.and.callFake(() => NEVER);
    userSettingsServiceSpy.getAccentColor.and.callFake(() => NEVER);
    versionServiceSpy.checkForUpdate.and.callFake(() => NEVER);
    shakeSpy.startWatch.and.callFake(() => NEVER);

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app (mobile)', fakeAsync(() => {
    // routerSpy.url.and.returnValue('/tabs');
    fcmSpy.onNotification.and.returnValue(NEVER);
    networkSpy.type.and.returnValue('wifi');
    userSettingsServiceSpy.darkThemeActivated.and.callFake(() => NEVER);
    userSettingsServiceSpy.PureDarkThemeActivated.and.callFake(() => NEVER);
    userSettingsServiceSpy.getAccentColor.and.callFake(() => NEVER);
    versionServiceSpy.checkForUpdate.and.callFake(() => NEVER);
    shakeSpy.startWatch.and.callFake(() => NEVER);

    const platform = TestBed.get(Platform);
    spyOn(platform, 'is').and.callFake(() => 'cordova');
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.get(Router);
    const navigateSpy = spyOn(router, 'navigate');

    fixture.detectChanges();
    expect(fcmSpy.onNotification).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(platform.is).toHaveBeenCalledTimes(1);
    expect(versionServiceSpy.checkForUpdate).toHaveBeenCalledTimes(1);
    tick(); // wait for platform promise
    expect(shakeSpy.startWatch).toHaveBeenCalledTimes(1);
  }));

  it('should initialize the app (web)', fakeAsync(() => {
    // routerSpy.url.and.returnValue('/tabs');
    fcmSpy.onNotification.and.returnValue(NEVER);
    userSettingsServiceSpy.darkThemeActivated.and.callFake(() => NEVER);
    userSettingsServiceSpy.PureDarkThemeActivated.and.callFake(() => NEVER);
    userSettingsServiceSpy.getAccentColor.and.callFake(() => NEVER);
    versionServiceSpy.checkForUpdate.and.callFake(() => NEVER);
    shakeSpy.startWatch.and.callFake(() => NEVER);

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.get(Router);
    const navigateSpy = spyOn(router, 'navigate');

    fixture.detectChanges();
    expect(fcmSpy.onNotification).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(versionServiceSpy.checkForUpdate).toHaveBeenCalledTimes(1);
    tick(); // wait for platform promise
    expect(shakeSpy.startWatch).not.toHaveBeenCalled();
  }));

});
