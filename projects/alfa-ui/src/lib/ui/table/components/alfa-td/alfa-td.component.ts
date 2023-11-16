import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { filter } from 'rxjs/operators';

import { AlfaTableService } from '../../services/alfa-table.service';
import { AlfaTableChangeCellSizeEvent } from '../../interface/events';
import { BaseComponent } from '../../../base-component/base-component.component';

/**
 * Cell component to display inside {@link AlfaTrComponent}.
 */
@Component({
    selector: 'alfa-td',
    templateUrl: './alfa-td.component.html',
    styleUrls: ['./alfa-td.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-td',
    },
})
export class AlfaTdComponent extends BaseComponent implements OnInit {
    /** Cell index setter */
    public set index(value: number) {
        this.internalIndex = value;
        /** Sets the width */
        this.cellWidth = this.service.getColSize(this.internalIndex);
    }

    /** Cell index getter */
    public get index(): number {
        return this.internalIndex;
    }

    /** Cell index */
    private internalIndex!: number;

    public set cellWidth(width: string | undefined) {
        if (width === undefined) {
            this.element.nativeElement.removeAttribute('style');
        } else {
            this.element.nativeElement.style.flexGrow = '0';
            this.element.nativeElement.style.flexShrink = '0';
            this.element.nativeElement.style.flexBasis = width;
        }
    }

    /** @ignore */
    constructor(
        private readonly element: ElementRef<HTMLElement>,
        private readonly service: AlfaTableService,
    ) {
        super();
    }

    /** @ignore */
    public ngOnInit(): void {
        this.service.cellSize
            .on()
            .pipe(filter((event: AlfaTableChangeCellSizeEvent) => this.index === event.index))
            .pipe(this.takeUntilDestroy())
            .subscribe((event: AlfaTableChangeCellSizeEvent) => {
                if (this.index === event.index) {
                    this.cellWidth = event.width;
                }
            });
    }
}
