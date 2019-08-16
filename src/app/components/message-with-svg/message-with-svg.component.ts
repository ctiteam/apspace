import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-with-svg',
  templateUrl: './message-with-svg.component.html',
  styleUrls: ['./message-with-svg.component.scss'],
})
export class MessageWithSvgComponent implements OnInit {
  @Input() messageTitle: string;
  @Input() messageContent?: string;
  @Input() imageUrl?: string;

  constructor() { }

  ngOnInit() {}

}
