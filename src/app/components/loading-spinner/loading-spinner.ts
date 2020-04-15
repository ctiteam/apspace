import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  templateUrl: 'loading-spinner.html',
  styleUrls: ['loading-spinner.css'],
})
export class LoadingSpinnerComponent {
  @Input() message?: string;
  @Input() size?: string;
}
