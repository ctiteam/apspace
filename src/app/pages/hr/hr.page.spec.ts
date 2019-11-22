import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { HrPage } from './hr.page';

describe('HrPage', () => {
  let component: HrPage;
  let fixture: ComponentFixture<HrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
