import { Observable } from 'rxjs';

import { AlfaTableRecord } from './record';
import { AlfaTableSort } from './sort';

/** Parameters of the get data function for table */
export interface AlfaTableDataFnParams {
    /** Page number */
    page?: number;
    /** Page size */
    size?: number;
    /** Sort */
    sort?: AlfaTableSort;
}

/** Function for getting data for table */
export type AlfaTableDataFn<T = AlfaTableRecord> = (
    params: AlfaTableDataFnParams,
) => Observable<T[]>;

/** Function of post-processing data after receiving */
export type AlfaTableAfterLoadFn<T = AlfaTableRecord> = (data: T[]) => T[] | Observable<T[]>;
