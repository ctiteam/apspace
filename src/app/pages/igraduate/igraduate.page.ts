import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-igraduate',
  templateUrl: './igraduate.page.html',
  styleUrls: ['./igraduate.page.scss'],
})
export class IgraduatePage implements OnInit {
  selectedSegment: 'studentsList' | 'report' = 'studentsList';
  constructor() { }

  ngOnInit() {
  }
  segmentValueChanged() {
    console.log('changed');
  }
}
