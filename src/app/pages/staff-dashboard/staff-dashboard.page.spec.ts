import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { StaffDashboardPage } from './staff-dashboard.page';

describe('StaffDashboardPage', () => {
  let component: StaffDashboardPage;
  let fixture: ComponentFixture<StaffDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffDashboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
