import { Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class ReactiveProperty<T> {
    public last: T | null = null;
    public current: T | null = null;
    private subject: Subject<T>;
    private observable: Observable<T>;
    private before: ((value: T, changes: { last: T | null; current: T | null }) => T) | undefined;

    /** @ignore */
    constructor(opt?: {
        subjectType?: Type<Subject<T>>;
        before?: (value: T, changes: { last: T | null; current: T | null }) => T;
        init?: T;
    }) {
        const subject = opt?.subjectType ?? Subject;
        this.subject = new subject();
        this.before = opt?.before;
        this.current = opt?.init ?? null;
        this.observable = this.subject.asObservable();
    }

    public emit(value: T): void {
        const prepared = this.before
            ? this.before(value, { last: this.last, current: this.current })
            : value;
        this.last = this.current;
        this.subject.next((this.current = prepared));
    }

    public on(): Observable<T> {
        return this.observable;
    }
}
