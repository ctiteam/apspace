import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-with-svg',
  templateUrl: './message-with-svg.component.html',
  styleUrls: ['./message-with-svg.component.scss'],
})
export class MessageWithSvgComponent {
  @Input() messageTitle: string;
  @Input() messageContent?: string;
  @Input() imageUrl?: string;
  @Input() wrapperMarginTop = '0px';
  @Input() wrapperOffset: string;
  @Input() wrapperSize: string;

  constructor() { }

}
