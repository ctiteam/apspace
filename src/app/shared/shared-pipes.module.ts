import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FusePipe } from '././fuse/fuse.pipe';
import { ReversePipe } from '././reverse/reverse.pipe';

@NgModule({
    declarations: [FusePipe, ReversePipe],
    imports: [CommonModule],
    exports: [FusePipe, ReversePipe]
})
export class SharedPipesModule { }
