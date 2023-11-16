export type AlfaTableRecord = Record<string, any>;

export interface AlfaTableSelected<T = AlfaTableRecord> {
    index: number;
    rec: T;
}
