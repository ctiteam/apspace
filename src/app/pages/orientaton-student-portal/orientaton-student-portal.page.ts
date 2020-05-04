import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orientaton-student-portal',
  templateUrl: './orientaton-student-portal.page.html',
  styleUrls: ['./orientaton-student-portal.page.scss'],
})
export class OrientatonStudentPortalPage implements OnInit {
  students = [
    { name: 'Kok Cheng Mun', id: 'TP023010', course: 'Foundation', intake: 'May 2020' },
    { name: 'Afshan Haneef', id: 'TP015386', course: 'Diploma', intake: 'May 2020' },
    { name: 'Lee Ai Mun', id: 'DH00001', course: 'Foundation', intake: 'May 2020' },
    { name: 'Chong Sau Mun', id: 'TP012345', course: 'Foundation', intake: 'May 2020' },
    { name: 'Muhammad Anis', id: 'DH00002', course: 'Foundation', intake: 'May 2020' }
  ];
  constructor() { }

  ngOnInit() {
  }

  viewProfile(student: any) {
    console.log(student);
  }

}
