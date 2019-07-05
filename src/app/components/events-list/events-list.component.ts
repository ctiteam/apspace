import { Component, Input, OnInit } from '@angular/core';
import { EventComponentConfigurations } from 'src/app/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'events-list',
  templateUrl: 'events-list.component.html',
  styleUrls: ['events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  @Input() observable$: Observable<EventComponentConfigurations[]>;
  skeletonConfigurations = {
    eventsSkeleton: new Array(8),
    
  }
  ngOnInit() {
  }
  splitTimeAndGetOnePart(part: 'third' | 'second' | 'first', time: string) {
    if (part === 'first') {
      return time.split(' ')[0]
    } else if (part === 'second') {
      return time.split(' ')[1]
    }
    return time.split(' ')[2]
  }

}
