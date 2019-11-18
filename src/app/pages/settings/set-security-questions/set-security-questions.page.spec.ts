import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NEVER } from 'rxjs';

import { WsApiService } from '../../../services';
import { SetSecurityQuestionsPage } from './set-security-questions.page';

describe('SetSecurityQuestionsPage', () => {
  let component: SetSecurityQuestionsPage;
  let fixture: ComponentFixture<SetSecurityQuestionsPage>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [ SetSecurityQuestionsPage ],
      providers: [
        { provide: WsApiService, useValue: wsSpy },
      ],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    wsSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(SetSecurityQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
