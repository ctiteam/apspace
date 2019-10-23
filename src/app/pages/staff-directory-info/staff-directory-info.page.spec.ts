import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ActivatedRoute, ActivatedRouteStub } from '../../../testing';

import { StaffDirectory } from '../../interfaces';
import { UrldecodePipe } from '../../pipes/urldecode.pipe';
import { WsApiService } from '../../services';
import { StaffDirectoryInfoPage } from './staff-directory-info.page';

describe('StaffDirectoryInfoPage', () => {
  let activatedRoute: ActivatedRouteStub;
  let component: StaffDirectoryInfoPage;
  let fixture: ComponentFixture<StaffDirectoryInfoPage>;
  let getSpy: jasmine.Spy;

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

    const wsApiService = jasmine.createSpyObj('WsApiService', ['get']);
    getSpy = wsApiService.get.and.returnValue(of(mockStaffDirectory));

    TestBed.configureTestingModule({
      declarations: [StaffDirectoryInfoPage, UrldecodePipe],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: WsApiService, useValue: wsApiService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
    fixture = TestBed.createComponent(StaffDirectoryInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    activatedRoute.setParamMap({ id: 1 });

    expect(component).toBeTruthy();
  });
});
