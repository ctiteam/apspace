import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NavController } from '@ionic/angular';

import { asyncData } from '../../../testing';
import { CasTicketService, SettingsService, UserSettingsService } from '../../services';
import { FuseModule } from '../../shared/fuse/fuse.module';
import { ByGroupPipe } from './by-group.pipe';
import { MorePage } from './more.page';

describe('MorePage', () => {
  let component: MorePage;
  let fixture: ComponentFixture<MorePage>;
  let navCtrlSpy: jasmine.Spy;
  let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async(() => {
    const navCtrl = jasmine.createSpyObj('NavController', ['navigateForward']);
    navCtrlSpy = navCtrl.navigateForward.and.returnValue(true);
    const cas = jasmine.createSpyObj('CasTicketService', ['getST']);
    cas.getST.and.returnValue(asyncData('ticket'));
    userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getMenuUI']);
    settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['get']);

    TestBed.configureTestingModule({
      declarations: [MorePage, ByGroupPipe],
      imports: [FuseModule],
      providers: [
        { provide: CasTicketService, useValue: cas },
        { provide: InAppBrowser, useValue: {} },
        { provide: NavController, useValue: navCtrl },
        { provide: Network, useValue: {} },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: SettingsService, useValue: settingsServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should route to local url', () => {
    component.openPage('/hello');
    expect(navCtrlSpy).toHaveBeenCalledWith(['/hello']);
  });

  it('should not route to external url', () => {
    component.openPage('https://external/hello');
    expect(navCtrlSpy).not.toHaveBeenCalled();
  });
});
