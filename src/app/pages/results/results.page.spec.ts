import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsPage } from './results.page';

describe('ResultsPage', () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
