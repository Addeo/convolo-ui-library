export type CnvErrorMessageHandler = string | ((data: Record<string, any>) => string);

export type CnvErrorHandlersRecord = Record<string, CnvErrorMessageHandler>;

export type CnvErrorConfig = {
    errors: CnvErrorHandlersRecord;
};
