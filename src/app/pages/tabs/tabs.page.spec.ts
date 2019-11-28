import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SettingsService } from '../../services';
import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let settings: { get: jasmine.Spy };

  beforeEach(async(() => {
    settings = jasmine.createSpyObj('SettingsService', ['get']);

    TestBed.configureTestingModule({
      declarations: [TabsPage],
      providers: [
        { provide: SettingsService, useValue: settings },
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    settings.get.and.returnValue(null);
    expect(component).toBeTruthy();
  });
});
