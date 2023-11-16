import { NgModule } from '@angular/core';
import { AlfaFormSelectComponent } from './alfa-select/alfa-form-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlfaFormInputComponent } from './alfa-input/alfa-form-input.component';

@NgModule({
    declarations: [AlfaFormInputComponent, AlfaFormSelectComponent],
    imports: [NgSelectModule],
    exports: [AlfaFormInputComponent, AlfaFormSelectComponent],
})
export class FormsModule {}
