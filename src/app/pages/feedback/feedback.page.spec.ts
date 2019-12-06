import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { FeedbackService, SettingsService, VersionService } from '../../services';
import { FeedbackPage } from './feedback.page';

describe('FeedbackPage', () => {
  let component: FeedbackPage;
  let fixture: ComponentFixture<FeedbackPage>;
  let platformSpy: jasmine.Spy;

  beforeEach(async(() => {
    const feedbackService = jasmine.createSpyObj('FeedbackService', ['platform']);
    platformSpy = feedbackService.platform.and.returnValue('Mozilla');

    const settingsService = jasmine.createSpyObj('SettingsService', ['get']);

    TestBed.configureTestingModule({
      declarations: [FeedbackPage],
      providers: [
        { provide: FeedbackService, useValue: feedbackService },
        { provide: InAppBrowser, useValue: {} },
        { provide: SettingsService, useValue: settingsService },
        { provide: VersionService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(platformSpy).toHaveBeenCalled();
  });
});
