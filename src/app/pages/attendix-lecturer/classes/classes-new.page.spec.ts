import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClassesNewPage } from './classes-new.page';

describe('ClassesNewPage', () => {
  let component: ClassesNewPage;
  let fixture: ComponentFixture<ClassesNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassesNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassesNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
