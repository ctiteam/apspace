import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { OperationHoursPage } from './operation-hours.page';

describe('OperationHoursPage', () => {
  let component: OperationHoursPage;
  let fixture: ComponentFixture<OperationHoursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationHoursPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationHoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
