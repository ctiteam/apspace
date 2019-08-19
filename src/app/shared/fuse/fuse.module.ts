import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FusePipe } from './fuse.pipe';

@NgModule({
  declarations: [FusePipe],
  imports: [CommonModule],
  exports: [FusePipe]
})
export class FuseModule { }
