import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { WsApiService } from '../../services';
import { FusePipe } from '../../shared/fuse/fuse.pipe';
import { DepartmentPipe } from './department.pipe';
import { StaffDirectoryPage } from './staff-directory.page';

describe('StaffDirectoryPage', () => {
  let component: StaffDirectoryPage;
  let fixture: ComponentFixture<StaffDirectoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentPipe, StaffDirectoryPage, FusePipe],
      providers: [
        { provide: WsApiService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffDirectoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
