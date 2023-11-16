import { Observable } from 'rxjs';

/** Parameters for loading when using loadDataFn, given out */
export interface AlfaSelectLoadDataParams {
    /** The size of the portion loaded at one time */
    readonly pageSize: number;
    /** Ordinal number of the portion to be loaded */
    pageNumber: number;
    /** Search string */
    searchTerm?: string;
    /** Values to search */
    searchValues?: any[];
}

/** Function to get data for the select */
export type AlfaSelectDataFn<T = Record<string, any>> = (
    params: AlfaSelectLoadDataParams,
) => Observable<T[]>;

export type AlfaSelectSize = 'normal' | 'medium' | 'small';

export type AlfaSelectSpecialType =
    | 'standard'
    | 'status-type'
    | 'date-picker'
