import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccessItemComponent } from './quick-access-item.component';

describe('QuickAccessItemComponent', () => {
  let component: QuickAccessItemComponent;
  let fixture: ComponentFixture<QuickAccessItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickAccessItemComponent]
    })
      .compileComponents();
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
