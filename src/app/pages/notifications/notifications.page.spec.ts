import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { NotificationService } from '../../services';
import { NotificationCategoryPipe } from './notification-category.pipe';
import { NotificationsPage } from './notifications.page';
import { UnreadMessagesOnlyPipe } from './unread-messages-only.pipe';

describe('NotificationsPage', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationsPage,
        NotificationCategoryPipe,
        UnreadMessagesOnlyPipe,
      ],
      providers: [
        { provide: NotificationService, useValue: {} },
        { provide: ModalController, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
