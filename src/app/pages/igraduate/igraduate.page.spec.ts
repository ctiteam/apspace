import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { NEVER } from 'rxjs';

import { WsApiService } from '../../services';
import { FilterPipe } from './filter.pipe';
import { IgraduatePage } from './igraduate.page';
import { StudentDetailsModalPage } from './student-details-modal';

describe('IgraduatePage', () => {
  let component: IgraduatePage;
  let fixture: ComponentFixture<IgraduatePage>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [IgraduatePage, FilterPipe, StudentDetailsModalPage],
      providers: [
        { provide: ModalController, useValue: {} },
        { provide: WsApiService, useValue: wsSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    wsSpy.get.and.returnValue(NEVER);
    fixture = TestBed.createComponent(IgraduatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
