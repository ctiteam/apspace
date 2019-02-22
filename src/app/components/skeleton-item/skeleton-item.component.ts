import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'skeleton-item',
  templateUrl: 'skeleton-item.component.html',
  styleUrls: ['skeleton-item.component.scss']
})
export class SkeletonItemComponent implements OnInit {

  @Input() width: string;
  @Input() height: string;
  @Input() radius: string;
  styles: { width?: string; height?: string, borderRadius?: string } = {};

  ngOnInit() {
    this.styles = {
      width: this.width ? this.width : '100%',
      height: this.height ? this.height : '16px',
    };

    if (this.radius !== undefined && this.radius !== '') {
      this.styles.borderRadius = this.radius;
    }
  }

}
