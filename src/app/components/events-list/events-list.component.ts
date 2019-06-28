import { Component, Input, OnInit } from '@angular/core';
import { EventComponentConfigurations } from 'src/app/interfaces';

@Component({
  selector: 'events-list',
  templateUrl: 'events-list.component.html',
  styleUrls: ['events-list.component.css']
})
export class EventsListComponent implements OnInit {
  @Input() eventsInput: EventComponentConfigurations[];
  events: {}[];

  ngOnInit() {
    this.events = this.eventsInput;
  }
}
