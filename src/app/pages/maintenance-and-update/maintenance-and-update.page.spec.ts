import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { MaintenanceAndUpdatePage } from './maintenance-and-update.page';

describe('MaintenanceAndUpdatePage', () => {
  let component: MaintenanceAndUpdatePage;
  let fixture: ComponentFixture<MaintenanceAndUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceAndUpdatePage ],
      providers: [
        { provide: InAppBrowser, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAndUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
