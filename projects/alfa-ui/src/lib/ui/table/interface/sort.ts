/** Sort */
export interface AlfaTableSort {
    /** Field to sort by */
    field: string;
    /** Sorting direction */
    order: AlfaTableSortOrder;
}

/** The sort order */
export const enum AlfaTableSortOrder {
    NONE,
    ASC,
    DESC,
}

/** Custom value comparison function for sorting */
export type AlfaTableSortFn = (val1: any, val2: any, order: AlfaTableSortOrder) => number;
