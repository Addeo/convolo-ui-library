import { Directive, OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Base component with unsubscribe implementation.
 *
 * @example
 * ```ts
 * @Component(...)
 * export class SomeComponent extends BaseComponent {
 *   doSomething() {
 *     timer(9999)
 *       .pipe(map(() => 'str'))
 *       .pipe(this.takeUntilDestroy<string>())
 *       .subscribe((res) => {
 *         console.log(res);
 *       });
 *   }
 * }
 * ```
 */
@Directive({
    selector: '[cnvBaseComponent]',
    standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class BaseComponent implements OnDestroy {
    private destroy: Subject<void> | undefined;

    protected takeUntilDestroy = <T>(): MonoTypeOperatorFunction<T> => {
        if (!this.destroy) this.destroy = new Subject<void>();
        return takeUntil<T>(this.destroy);
    };

    public ngOnDestroy(): void {
        if (this.destroy) {
            this.destroy.next();
            this.destroy.complete();
        }
    }
}
