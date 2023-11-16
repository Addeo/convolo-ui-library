import { Subject } from 'rxjs';
import { ToastPosition, ToastType } from './alfa-toaster.interface';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    toastSubscriber$ = new Subject<any>();
    constructor() {}

    show(
        title: string,
        message: string,
        type: ToastType = ToastType.Info,
        seconds: number = 3,
        position: ToastPosition = ToastPosition.TopRight,
    ) {
        this.toastSubscriber$.next({ title, message, seconds, type, position });
    }
}
