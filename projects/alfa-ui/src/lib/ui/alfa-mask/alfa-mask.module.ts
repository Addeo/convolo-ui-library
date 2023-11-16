import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DateFormatterPipe } from './dates/date-formatter.pipe';
import { DateParserPipe } from './dates/date-parser.pipe';
import { MaskBaseDirective } from './mask/mask-base.directive';
import { MaskDateDirective } from './mask/mask-date.directive';
import { MaskNumberDirective } from './mask/mask-number.directive';
import { MaskDirective } from './mask/mask.directive';

@NgModule({
    declarations: [
        DateFormatterPipe,
        DateParserPipe,
        MaskBaseDirective,
        MaskDateDirective,
        MaskDirective,
        MaskNumberDirective,
    ],
    imports: [FormsModule],
    exports: [
        DateFormatterPipe,
        DateParserPipe,
        MaskDateDirective,
        MaskDirective,
        MaskNumberDirective,
    ],
})
export class AlfaMaskModule {
    public static forRoot(): ModuleWithProviders<AlfaMaskModule> {
        return {
            ngModule: AlfaMaskModule,
            providers: [],
        };
    }
}
