import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { BaseComponent } from '../../../base-component/base-component.component';

@Component({
    selector: 'alfa-table-actions',
    templateUrl: './alfa-table-actions.component.html',
    styleUrls: ['./alfa-table-actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-table-actions',
    },
})
export class AlfaTableActionsComponent extends BaseComponent implements OnChanges, OnInit {
    @Input() public count = 0;
    @Input() public visible = false;

    @Output() private clickClose = new EventEmitter<void>();

    @HostBinding('class.visually-hidden') private visuallyHidden = !this.visible;

    /** @ignore */
    constructor(public changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    /** @ignore */
    public ngOnChanges(changes: SimpleChanges): void {
        //@ts-ignore
        if (changes.visible) {
            //@ts-ignore
            this.visuallyHidden = !changes.visible.currentValue;
        }
    }

    /** @ignore */
    public ngOnInit(): void {}

    public onCloseButtonClick(): void {
        this.clickClose.emit();
    }
}
