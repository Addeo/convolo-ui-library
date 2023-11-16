import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlfaFocusTrapDirective } from './alfa-focus-trap';
import {AlfaDragDropDirective} from "./alfa-drag-drop";

@NgModule({
    imports: [CommonModule],
    declarations: [AlfaFocusTrapDirective, AlfaDragDropDirective],
    exports: [AlfaFocusTrapDirective, AlfaDragDropDirective],
})
export class AlfaDirectivesModule {}
