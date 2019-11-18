import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';

import { StudentTimetableService } from './student-timetable.service';

describe('StudentTimetableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: {} },
        { provide: Network, useValue: {} },
        { provide: Storage, useValue: {} },
      ],
      imports: [RouterTestingModule]
    });
  });

  it('should be created', () => {
    const service: StudentTimetableService = TestBed.get(StudentTimetableService);
    expect(service).toBeTruthy();
  });
});
