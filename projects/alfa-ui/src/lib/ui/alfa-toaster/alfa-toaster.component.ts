import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastPosition, ToastType } from './alfa-toaster.interface';
// import { CnvIconsModule } from '$components/alfa-icons';
import { ToastService } from './alfa-toaster.service';
import { AlfaToasterMessageComponent } from './alfa-toaster-message/alfa-toaster-message.component';

@Component({
    selector: 'alfa-toaster',
    templateUrl: './alfa-toaster.component.html',
    styleUrls: ['./alfa-toaster.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-toaster',
    },
    standalone: true,
    imports: [CommonModule,
      // CnvIconsModule,
      AlfaToasterMessageComponent],
})
export class AlfaToasterComponent implements OnInit, AfterViewInit {
    public title: string;
    public message: string;
    public timeout: number = 5;
    public position: ToastPosition;
    public type: ToastType;
    private componentRef: ComponentRef<AlfaToasterMessageComponent> | null = null;
    @ViewChild('viewContainerRef', { read: ViewContainerRef }) vcr!: ViewContainerRef;
    @ViewChild('wrapper') wrapperToast!: ElementRef;

    constructor(
        private toastService: ToastService,
        private resolver: ComponentFactoryResolver,
        protected changeDetectorRef: ChangeDetectorRef,
    ) {
        this.title = 'Information';
        this.message =
            "Here's some important information you should know. Stay informed and make informed decisions.";
        this.timeout = 5;
        this.position = ToastPosition.TopRight;
        this.type = ToastType.Warning;
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.toastService.toastSubscriber$.subscribe((value) => {
            if (value) {
                this.showToastMessage(value);
            }
        });
    }

    showToastMessage({
        title,
        message,
        position,
        seconds,
        type,
    }: {
        title: string;
        message: string;
        position: ToastPosition;
        seconds: number;
        type: ToastType;
    }) {
        let factory = this.resolver.resolveComponentFactory(AlfaToasterMessageComponent);
        this.componentRef = this.vcr.createComponent(factory);
        this.componentRef.instance.title = title;
        this.componentRef.instance.message = message;
        this.componentRef.instance.position = position;
        this.componentRef.instance.type = type;
        this.componentRef.instance.seconds = seconds;
        this.componentRef.instance.ref = this.componentRef;

        this.wrapperToast.nativeElement.removeAttribute('class');
        this.wrapperToast.nativeElement.setAttribute(
            'class',
            'alfa-toast-wrapper active ' + position,
        );

        position != 'position-center'
            ? (this.wrapperToast.nativeElement.style.top = `calc(2% + ${window.scrollY}px)`)
            : (this.wrapperToast.nativeElement.style.top = '');
        this.changeDetectorRef.markForCheck();
    }
}
