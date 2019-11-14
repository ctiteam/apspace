import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { QuickAccessItemComponent } from './quick-access-item.component';

describe('QuickAccessItemComponent', () => {
  let component: QuickAccessItemComponent;
  let fixture: ComponentFixture<QuickAccessItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickAccessItemComponent],
      providers: [
        { provide: NavController, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAccessItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
