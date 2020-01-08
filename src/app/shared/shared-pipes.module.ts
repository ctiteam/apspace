import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FusePipe } from './fuse/fuse.pipe';
import { ReversePipe } from './reverse/reverse.pipe';
import { SafePipe } from './safe/safe.pipe';

@NgModule({
    declarations: [FusePipe, ReversePipe, SafePipe],
    imports: [CommonModule],
    exports: [FusePipe, ReversePipe, SafePipe]
})
export class SharedPipesModule { }
