import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Self,
  SimpleChanges, TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {AlfaModalService} from "../alfa-modal";
import {AlfaButtonDirective} from "../alfa-button";

@Component({
    selector: 'alfa-preview',
    templateUrl: './alfa-preview.component.html',
    styleUrls: ['./alfa-preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        class: 'alfa-preview',
    },
    imports: [CommonModule, AlfaButtonDirective],
})
export class AlfaPreviewComponent
{

    @Input() title: string = '';
    @Input() src: string = '';

    @ViewChild('previewModal')
    public modalFollowUpCall!: TemplateRef<any>;

    constructor(private readonly alfaModalService: AlfaModalService) {}

    openPreview() {
      this.alfaModalService.open(this.modalFollowUpCall);
    }

}
