import { Directive, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

/** Button sizes */
export type AlfaButtonSize = 'extra-small' | 'small' | 'medium' | 'normal' | 'large';

/** Button variants */
export type AlfaButtonKind =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'warning'
    | 'text'
    | 'success'
    | 'gray';

/**
 * Directive for style `button` and `a` elements.
 *
 * @example
 * ```html
 * <button
 *   alfaButton
 *   type="submit"
 *   size="large"
 *   kind="primary">
 *   Save
 * </button>
 * ```
 */
@Directive({
    selector: 'button[alfaButton], a[alfaButton]',
    host: {
        class: 'alfa-button',
    },
    standalone: true,
})
export class AlfaButtonDirective implements OnInit, OnChanges {
    /** Button size */
    @Input() public size: AlfaButtonSize = 'normal';
    /** Button variant */
    @Input() public kind: AlfaButtonKind = 'primary';

    /** @ignore */
    @HostBinding('class') public classes = '';

    /** @ignore */
    public ngOnInit(): void {
        this.setClasses();
    }

    /** @ignore */
    public ngOnChanges(changes: SimpleChanges): void {
        this.setClasses();
    }

    /** Set classes on host element */
    private setClasses(): void {
        this.classes = `alfa-button_size_${this.size} alfa-button_kind_${this.kind}`;
    }
}
