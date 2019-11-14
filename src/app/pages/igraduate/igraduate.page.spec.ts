import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { IgraduatePage } from './igraduate.page';

describe('IgraduatePage', () => {
  let component: IgraduatePage;
  let fixture: ComponentFixture<IgraduatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgraduatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgraduatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
