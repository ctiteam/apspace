import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DateWithTimezonePipe } from './date-with-timezone/date-with-timezone.pipe';
import { FusePipe } from './fuse/fuse.pipe';
import { ReversePipe } from './reverse/reverse.pipe';
import { SafePipe } from './safe/safe.pipe';

@NgModule({
    declarations: [FusePipe, ReversePipe, SafePipe, DateWithTimezonePipe],
    imports: [CommonModule],
    exports: [FusePipe, ReversePipe, SafePipe, DateWithTimezonePipe]
})
export class SharedPipesModule { }
