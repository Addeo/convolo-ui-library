import { AlfaTableRecord } from './record';
import { AlfaTableSortOrder } from './sort';

/** Internal event of selecting a row in the table */
export interface AlfaTableRowSelectedEvent {
    /** Row index */
    index: number;
    /** Flag selected or unselected */
    isSelected: boolean;
}

/** Table row selection event */
export interface AlfaTableRowSelectedOutputEvent<T = AlfaTableRecord>
    extends AlfaTableRowSelectedEvent {
    /** The record that was selected or unselected */
    rec: T;
}

/** Internal sort event */
export interface AlfaTableSortOrderEvent {
    /** Cell index */
    index: number;
    /** Field */
    field: string;
    /** Direction */
    sortOrder: AlfaTableSortOrder;
}

/** Cell resize event in header */
export interface AlfaTableChangeCellSizeEvent {
    /** Cell index */
    index: number;
    /** Width (CSS-valid string) */
    width: string | undefined;
}
