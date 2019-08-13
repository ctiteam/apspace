import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CasTicketService } from '../../services';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';

import { asyncData } from '../../../testing';
import { FuseModule } from '../../shared/fuse/fuse.module';
import { MorePage } from './more.page';

describe('MorePage', () => {
  let component: MorePage;
  let fixture: ComponentFixture<MorePage>;
  let routerSpy: jasmine.Spy;

  beforeEach(async(() => {
    const router = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy = router.navigate.and.returnValue(true);
    const cas = jasmine.createSpyObj('CasTicketService', ['getST']);
    cas.getST.and.returnValue(asyncData('ticket'));

    TestBed.configureTestingModule({
      declarations: [MorePage],
      imports: [FuseModule],
      providers: [
        { provide: CasTicketService, useValue: cas },
        { provide: InAppBrowser, useValue: {} },
        { provide: Router, useValue: router },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should route to local url', () => {
    component.openPage('/hello');
    expect(routerSpy).toHaveBeenCalledWith(['/hello']);
  });

  it('should not route to external url', () => {
    component.openPage('https://external/hello');
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
