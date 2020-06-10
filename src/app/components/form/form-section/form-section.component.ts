import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.scss'],
})
export class FormSectionComponent implements OnInit {
  @Input() title: string;

  constructor() { }

  ngOnInit() {}

}
