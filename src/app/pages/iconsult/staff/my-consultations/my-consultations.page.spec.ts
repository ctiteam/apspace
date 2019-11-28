import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MyConsultationsPage } from './my-consultations.page';

xdescribe('MyConsultationsPage', () => {
  let component: MyConsultationsPage;
  let fixture: ComponentFixture<MyConsultationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyConsultationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyConsultationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
