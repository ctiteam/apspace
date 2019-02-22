import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakePicturePage } from './take-picture.page';

describe('TakePicturePage', () => {
  let component: TakePicturePage;
  let fixture: ComponentFixture<TakePicturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakePicturePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakePicturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
