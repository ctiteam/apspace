import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudentsSearchPage } from './students-search.page';

describe('StudentsSearchPage', () => {
  let component: StudentsSearchPage;
  let fixture: ComponentFixture<StudentsSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
