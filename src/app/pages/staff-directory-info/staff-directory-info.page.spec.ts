import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { of } from 'rxjs';

import { ActivatedRouteStub } from '../../../testing';
import { StaffDirectory } from '../../interfaces';
import { UrldecodePipe } from '../../pipes/urldecode.pipe';
import { WsApiService } from '../../services';
import { StaffDirectoryInfoPage } from './staff-directory-info.page';

describe('StaffDirectoryInfoPage', () => {
  let activatedRoute: ActivatedRouteStub;
  let component: StaffDirectoryInfoPage;
  let fixture: ComponentFixture<StaffDirectoryInfoPage>;
  let getSpy: jasmine.Spy;
  let routerSpy: jasmine.Spy;

  beforeEach(async(() => {
    const mockStaffDirectory: StaffDirectory[] = [
      {
        CODE: 'ZUHAIRAH',
        DEPARTMENT: 'Academic Administration',
        DEPARTMENT2: '',
        DEPARTMENT3: '',
        DID: '',
        EMAIL: 'zuhairah@apu.edu.my',
        EXTENSION: '',
        FULLNAME: 'ZUHAIRAH BINTI KUNCH AHAMMED',
        ID: 'zuhairah',
        LOCATION: null,
        PHOTO: 'https://d37plr7tnxt7lb.cloudfront.net/738.jpg',
        RefNo: 738,
        TITLE: 'Assistant Manager, Academic Administration'
      },
      {
        CODE: 'JULIE',
        DEPARTMENT: 'Student Services and Marketing',
        DEPARTMENT2: '',
        DEPARTMENT3: '',
        DID: '',
        EMAIL: 'julie@apu.edu.my',
        EXTENSION: '',
        FULLNAME: 'ZULIANA TONG BINTI ABDULLAH',
        ID: 'julie',
        LOCATION: null,
        PHOTO: 'https://d37plr7tnxt7lb.cloudfront.net/75.jpg',
        RefNo: 75,
        TITLE: 'Senior Manager, Student Services (Administration)'
      },
      {
        CODE: 'ZULKIFLI',
        DEPARTMENT: 'Student Services and Marketing',
        DEPARTMENT2: '',
        DEPARTMENT3: '',
        DID: '',
        EMAIL: 'zulkifli@apu.edu.my',
        EXTENSION: '',
        FULLNAME: 'ZULKIFLLI BIN MOHD SHOKHIR',
        ID: 'zulkifli',
        LOCATION: null,
        PHOTO: 'https://d37plr7tnxt7lb.cloudfront.net/740.jpg',
        RefNo: 740,
        TITLE: 'Executive, Student Services'
      }
    ];

    const ws = jasmine.createSpyObj('WsApiService', ['get']);
    getSpy = ws.get.and.returnValue(of(mockStaffDirectory));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [StaffDirectoryInfoPage, UrldecodePipe],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AppAvailability, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: WsApiService, useValue: ws },
        { provide: InAppBrowser, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    activatedRoute.setParams({ id: 1 });

    fixture = TestBed.createComponent(StaffDirectoryInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(getSpy).toHaveBeenCalled();
  });
});
