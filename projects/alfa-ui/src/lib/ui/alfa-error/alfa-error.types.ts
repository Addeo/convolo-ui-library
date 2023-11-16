export type AlfaErrorMessageHandler = string | ((data: Record<string, any>) => string);

export type AlfaErrorHandlersRecord = Record<string, AlfaErrorMessageHandler>;

export type AlfaErrorConfig = {
    errors: AlfaErrorHandlersRecord;
};
