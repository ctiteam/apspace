import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, NEVER } from 'rxjs';
import { ReversePipe } from 'src/app/shared/reverse/reverse.pipe';
import { SettingsService, WsApiService } from '../../services';
import { StudentSurveyPage } from './student-survey.page';


describe('StudentSurveyPage', () => {
  let component: StudentSurveyPage;
  let fixture: ComponentFixture<StudentSurveyPage>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get']);
    TestBed.configureTestingModule({
      declarations: [StudentSurveyPage, ReversePipe],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: EMPTY } },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: WsApiService, useValue: wsSpy },
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    wsSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(StudentSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const router = TestBed.inject(Router);
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
