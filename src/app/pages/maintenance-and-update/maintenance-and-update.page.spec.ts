import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { MaintenanceAndUpdatePage } from './maintenance-and-update.page';

describe('MaintenanceAndUpdatePage', () => {
  let component: MaintenanceAndUpdatePage;
  let fixture: ComponentFixture<MaintenanceAndUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceAndUpdatePage],
      providers: [
        { provide: InAppBrowser, useValue: {} },
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'getCurrentNavigation').and.returnValue({
      id: 1,
      initialUrl: router.createUrlTree(['/']),
      extractedUrl: router.createUrlTree(['/']),
      extras: { state: {} },
      trigger: 'imperative',
      previousNavigation: null
    });

    fixture = TestBed.createComponent(MaintenanceAndUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
