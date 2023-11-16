/* eslint-disable eqeqeq */
import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { KeyInfo, Keys } from '../keys/keys.class';
import { Action, MaskResult } from './mask-section.class';
import { MaskState } from './mask-state.class';
import { Mask } from './mask.class';

@Directive({
    selector: '[cnvMaskBase]',
})
export class MaskBaseDirective {
    private _undo: Array<MaskResult> = [];
    private _redo: Array<MaskResult> = [];

    // Current text value
    protected _txtValue = '';
    protected _mask: Mask;

    protected androidBehavior = false;
    protected lastRes?: MaskResult;

    @Input()
    public readonly: boolean = false;

    // On state change
    // eslint-disable-next-line @angular-eslint/no-output-rename
    @Output('cnvStateChange')
    public stateChange = new EventEmitter<MaskState | null>();

    // Fetching mask state
    private _state: MaskState | null = null;

    public get state(): MaskState | null {
        return this._state;
    }

    public set state(v: MaskState | null) {
        if (this._state != v) {
            this._state = v;
            this.stateChange.emit(this._state); // Emitting event
        }
    }

    protected updateState(): void {
        //
    }

    protected processAndroid(txt: any): void {
        if (!this.lastRes) return;

        //
        const res = this.currentRes();

        // Possibly we have carriage position
        const key: KeyInfo = Keys.whichKeyHasBeenPressed(
            this.lastRes.newValue,
            txt,
            this.lastRes.selStart,
            res.selStart,
            this.lastRes.selLength,
        );

        const r = this.processKey({
            keyCode: -1,
            key: key.code,
            char: key.char,
            shiftKey: false,
            ctrlKey: false,
            target: { selectionStart: this.lastRes.selStart, selectionEnd: 0 },
            preventDefault: (_: any) => {},
        });

        if (!r) this.setRes(this.lastRes); // Reversing, value has not been accepted

        this.androidBehavior = false;
        return;
    }

    protected doInput(txt: any): void {
        if (this.androidBehavior) {
            this.processAndroid(txt);
            return;
        }

        // Thus we're trying to apply a mask to value entered
        const masked = this._mask.applyMask(txt);
        if (masked !== this._txtValue) this.setText(masked, true);
    }

    public processKey(e: any): boolean | undefined {
        if (this.readonly) return;

        if (e.keyCode === 229 || e.keyCode === 0 || e.keyCode === undefined) {
            // Android detected
            this.androidBehavior = true;
            this.lastRes = this.currentRes();
            return;
        }

        let c: string = e.char;
        if (c === undefined) c = e.key;

        let selStart: number = e.target.selectionStart;
        let selEnd: number = e.target.selectionEnd;
        let s = this._txtValue;

        if (Keys.isFunctional(e.keyCode)) return true;

        if (e.keyCode === Keys.TAB || e.keyCode === Keys.ESCAPE) {
            return true;
        }

        if (e.keyCode === Keys.HOME || e.keyCode === Keys.END) {
            return true;
        }

        if (
            e.ctrlKey &&
            (e.keyCode === Keys.A ||
                e.keyCode === Keys.X ||
                e.keyCode === Keys.C ||
                e.keyCode === Keys.V ||
                e.keyCode === Keys.INSERT)
        ) {
            return true;
        }

        if (e.shiftKey && (e.keyCode === Keys.DELETE || e.keyCode === Keys.INSERT)) {
            return true;
        }

        if (e.altKey && (e.keyCode === Keys.DOWN || e.keyCode === Keys.UP)) {
            return true;
        }

        if (e.ctrlKey && e.keyCode === Keys.Z) {
            // UNDO
            const undoRes = this._undo.pop();
            if (undoRes) {
                this._redo.push(this.getRes(s, selStart, selEnd));
                this.setRes(undoRes);
            }
            e.preventDefault();
            return false;
        }

        if (e.ctrlKey && e.keyCode === Keys.Y) {
            // REDO
            const redoRes = this._redo.pop();
            if (redoRes) {
                this._undo.push(this.getRes(s, selStart, selEnd));
                this.setRes(redoRes);
            }
            e.preventDefault();
            return false;
        }

        const hasTxtValue: boolean = this._txtValue !== undefined && this._txtValue !== null;

        // If everything is selected
        if (hasTxtValue && selStart === 0 && selEnd === this._txtValue.length) {
            if (e.keyCode === Keys.DELETE || e.keyCode === Keys.BACKSPACE) return true;

            // If ArrowLeft key has been pressed, result should equal to pressing of Home
            if (e.keyCode === Keys.LEFT) {
                return true;
            }

            if (e.keyCode === Keys.RIGHT) {
                return true;
            }
        }

        if (!hasTxtValue || (selStart === 0 && selEnd === this._txtValue.length)) {
            s = '';
            selStart = 0;
            selEnd = 0;
        }

        // Applying everything that's left
        const res: MaskResult = this._mask.applyKeyAtPos(s, e.keyCode, c, selStart, selEnd);

        if (res != null && res.action === Action.APPLY) {
            // If value has been changed we'll add it to UNDO stack
            if (res.newValue != s) {
                this._undo.push(this.getRes(s, selStart, selEnd));
                this._redo = [];
            }

            this.setRes(res);

            if (this.androidBehavior) return true;

            e.preventDefault();
        }

        return false;
    }

    // Setting value and carriage position
    protected setRes(res: MaskResult): void {
        if (this.androidBehavior) res.selLength = 0;

        this.setText(res.newValue);
        this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', res.selStart);
        this._renderer.setProperty(
            this._elementRef.nativeElement,
            'selectionEnd',
            res.selStart + res.selLength,
        );
    }

    protected currentRes(): MaskResult {
        const res = new MaskResult(this._txtValue, Action.APPLY, 0);
        res.selStart = this._elementRef.nativeElement.selectionStart;
        res.selLength = this._elementRef.nativeElement.selectionEnd - res.selStart;
        return res;
    }

    // Retrieving current mask value and carriage position
    protected getRes(s: string, selStart: number, selEnd: number): MaskResult {
        const res = new MaskResult(s, Action.APPLY, 0);
        res.selStart = selStart;
        res.selLength = selEnd - selStart;
        return res;
    }

    // Following method should be overridden
    protected toModel(): void {}

    // Writing a text to control
    protected setText(displayedValue: string, toModel: boolean = true): void {
        // Displaying
        this._txtValue = displayedValue;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', this._txtValue);

        // Sending to model
        if (toModel) this.toModel();
    }

    constructor(
        protected _renderer: Renderer2,
        protected _elementRef: ElementRef,
    ) {
        this._mask = new Mask();
    }
}
