import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CustomDateTimePipe } from './customdatepipe/customdatetime';
import { FusePipe } from './fuse/fuse.pipe';
import { ReversePipe } from './reverse/reverse.pipe';
import { SafePipe } from './safe/safe.pipe';

@NgModule({
    declarations: [FusePipe, ReversePipe, SafePipe, CustomDateTimePipe],
    imports: [CommonModule],
    exports: [FusePipe, ReversePipe, SafePipe, CustomDateTimePipe]
})
export class SharedPipesModule { }
