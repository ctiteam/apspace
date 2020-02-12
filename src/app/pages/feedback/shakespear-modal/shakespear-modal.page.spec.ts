import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { Camera } from '@ionic-native/camera/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { FeedbackService, WsApiService } from 'src/app/services';
import { ShakespearModalPage } from './shakespear-modal.page';

describe('ShakespearModalPage', () => {
  let component: ShakespearModalPage;
  let feedbackSpy: jasmine.SpyObj<FeedbackService>;
  let fixture: ComponentFixture<ShakespearModalPage>;

  beforeEach(async(() => {
    feedbackSpy = jasmine.createSpyObj('FeedbackService', ['platform']);

    TestBed.configureTestingModule({
      declarations: [ShakespearModalPage],
      imports: [RouterTestingModule],
      providers: [
        { provide: FeedbackService, useValue: feedbackSpy },
        { provide: WsApiService, useValue: {} },
        { provide: InAppBrowser, useValue: {} },
        { provide: Network, useValue: {} },
        { provide: Storage, useValue: {} },
        { provide: Camera, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(ShakespearModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
