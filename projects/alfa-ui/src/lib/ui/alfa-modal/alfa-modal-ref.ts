import { ComponentRef, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

type JustProps<T extends object> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K];
};

export abstract class AlfaModalRef<
    Data = any,
    Result = any,
    Ref extends ComponentRef<any> | TemplateRef<any> = ComponentRef<any> | TemplateRef<any>,
> {
    public ref!: Ref;
    public data!: Data;

    public backdropClick$!: Observable<MouseEvent[]>;
    public onClose$!: Observable<Result>;

    public onNextClick$!: Observable<Result>;
    public onBackClick$!: Observable<Result>;
    public onSaveClick$!: Observable<Result>;

    public afterClose$!: Observable<Result>;

    public abstract close(result?: Result): void;
    public abstract next(result?: Result): void;
    public abstract back(result?: Result): void;

    public nextDisabled$!: Observable<boolean>;
    public backDisabled$!: Observable<boolean>;
    public saveDisabled$!: Observable<boolean>;
    public showNext$!: Observable<boolean>;
    public showBack$!: Observable<boolean>;

    public abstract setNextDisabled(state: boolean): void;
    public abstract setBackDisabled(state: boolean): void;
    public abstract setSaveDisabled(state: boolean): void;
    public abstract setNextShow(state: boolean): void;
    public abstract setBackShow(state: boolean): void;
}

export class AlfaInternalModalRef extends AlfaModalRef {
    // @ts-ignore
    public backdropClick$!: Subject<MouseEvent[]>;
    // @ts-ignore
    public onClose$!: Subject<unknown>;

    // @ts-ignore
    public onNextClick$!: Subject<unknown>;
    // @ts-ignore
    public onBackClick$!: Subject<unknown>;
    // @ts-ignore
    public onSaveClick$!: Subject<unknown>;
    // @ts-ignore
    public nextDisabled$!: Subject<boolean>;
    // @ts-ignore
    public backDisabled$!: Subject<boolean>;
    // @ts-ignore
    public saveDisabled$!: Subject<boolean>;
    // @ts-ignore
    public showNext$!: Subject<boolean>;
    // @ts-ignore
    public showBack$!: Subject<boolean>;

    constructor(props: Partial<JustProps<AlfaInternalModalRef>> = {}) {
        super();
        this.data = props.data;
    }

    public onClose!: (result?: unknown) => void;

    public close(result?: unknown): void {
        this.onClose$.next(result);
    }

    public next(result?: unknown): void {
        this.onNextClick$.next(result);
    }

    public back(result?: unknown): void {
        this.onBackClick$.next(result);
    }

    public save(result?: unknown): void {
        this.onSaveClick$.next(result);
    }

    public asModalRef(): AlfaModalRef {
        return this;
    }

    public setNextDisabled(state: boolean) {
        this.nextDisabled$.next(state);
    }

    public setBackDisabled(state: boolean) {
        this.backDisabled$.next(state);
    }

    public setSaveDisabled(state: boolean) {
        this.saveDisabled$.next(state);
    }

    public setNextShow(state: boolean) {
        this.showNext$.next(state);
    }

    public setBackShow(state: boolean) {
        this.showBack$.next(state);
    }
}
