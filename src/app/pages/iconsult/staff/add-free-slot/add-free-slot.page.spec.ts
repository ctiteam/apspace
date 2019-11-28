import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AddFreeSlotPage } from './add-free-slot.page';

xdescribe('AddFreeSlotPage', () => {
  let component: AddFreeSlotPage;
  let fixture: ComponentFixture<AddFreeSlotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFreeSlotPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFreeSlotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
