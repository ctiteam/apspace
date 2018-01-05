import { Pipe, PipeTransform } from '@angular/core';

import { Timetable } from '../../interfaces/timetable';
import { StaffDirectory } from '../../interfaces/staff-directory';
import { StaffDirectoryProvider } from '../../providers/staff-directory/staff-directory';

@Pipe({ name: 'toStaff', pure: false  }) /* TODO: make this pipe pure */
export class ToStaffPipe implements PipeTransform {

  // staff = [] as StaffDirectory[];
  // 
  // constructor(public sd: StaffDirectoryProvider) {
  //   sd.getStaffDirectory().subscribe(staff => this.staff = staff);
  // }

  transform(t: Timetable, staff: StaffDirectory[]): StaffDirectory {
    return staff.find(s => s.ID === t.LECTID);
  }
}
