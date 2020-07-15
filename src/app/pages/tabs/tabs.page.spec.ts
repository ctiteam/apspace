import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from '@ionic/storage';

import { Role } from '../../interfaces';
import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get']);

    TestBed.configureTestingModule({
      declarations: [TabsPage],
      providers: [
        { provide: Storage, useValue: storageSpy },
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    storageSpy.get.and.returnValue(Promise.resolve(Role.Student));
    expect(component).toBeTruthy();
  });
});
