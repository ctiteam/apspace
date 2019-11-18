import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY } from 'rxjs';

import { SettingsService, WsApiService } from '../../services';
import { StudentSurveyPage } from './student-survey.page';

describe('StudentSurveyPage', () => {
  let component: StudentSurveyPage;
  let fixture: ComponentFixture<StudentSurveyPage>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async(() => {
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get']);
    TestBed.configureTestingModule({
      declarations: [StudentSurveyPage],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: EMPTY } },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: WsApiService, useValue: {} },
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'getCurrentNavigation').and.returnValue({
      id: 1,
      initialUrl: router.createUrlTree(['/']),
      extractedUrl: router.createUrlTree(['/']),
      extras: { state: {} },
      trigger: 'imperative',
      previousNavigation: null
    });
    expect(component).toBeTruthy();
  });
});
