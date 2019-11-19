import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { OpenedSlotsPage } from './opened-slots.page';

xdescribe('OpenedSlotsPage', () => {
  let component: OpenedSlotsPage;
  let fixture: ComponentFixture<OpenedSlotsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenedSlotsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenedSlotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
