import { CommonModule } from '@angular/common';
import {
    Component,
    ComponentRef,
    HostBinding,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
// import { CnvIconsModule } from '$components/alfa-icons';

@Component({
    selector: 'alfa-toaster-message',
    templateUrl: './alfa-toaster-message.component.html',
    styleUrls: ['./alfa-toaster-message.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-toaster-message',
    },
    standalone: true,
    imports: [CommonModule,
      // CnvIconsModule
    ],
})
export class AlfaToasterMessageComponent implements OnInit {
    @Input() title: string = 'Test title';
    @Input() message: string = 'Test message';
    @Input() position: string = '';
    @Input() type: string = '';
    @Input() seconds: string | number = '';
    @Input() ref: ComponentRef<AlfaToasterMessageComponent> | null = null;

    @HostBinding('class')
    public get classes(): string {
        return `
            ${this.type ? 'alfa-toaster_type__' + this.type : ''}
            ${this.position}
        `;
    }

    constructor() {}

    ngOnInit(): void {
        setTimeout(() => {
            this.closeMe();
        }, +this.seconds * 1000);
    }

    closeMe() {
        this.ref && this.ref.destroy();
    }
}
