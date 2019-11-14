import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonSelect, ModalController } from '@ionic/angular';
import { NEVER } from 'rxjs';

import { StudentTimetableService, WsApiService } from '../../../services';
import { ClassesPage } from './classes.page';

describe('ClassesPage', () => {
  let component: ClassesPage;
  let fixture: ComponentFixture<ClassesPage>;
  let ttSpy: jasmine.SpyObj<StudentTimetableService>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    ttSpy = jasmine.createSpyObj('StudentTimetableService', ['get']);
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [ClassesPage, IonSelect],
      providers: [
        { provide: ModalController, useValue: {} },
        { provide: StudentTimetableService, useValue: ttSpy },
        { provide: WsApiService, useValue: wsSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    ttSpy.get.and.returnValue(NEVER);
    wsSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(ClassesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(ttSpy.get).toHaveBeenCalledTimes(1);
    expect(wsSpy.get).toHaveBeenCalledTimes(2);
    expect(wsSpy.get).toHaveBeenCalledWith('/staff/profile', { caching: 'cache-only' });
    expect(wsSpy.get).toHaveBeenCalledWith('/attendix/classcodes');
  });
});
