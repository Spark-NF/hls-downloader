import { IConfig } from "./Config";

export interface ILogger {
    log: (...params: any) => void;
    error: (...params: any) => void;
}

export function buildLogger(logger: IConfig["logger"]): ILogger {
    if (logger === undefined) {
        return console;
    }
    if (logger === null) {
        return buildLogger(() => { /* no-op */ });
    }
    if (typeof logger === "function") {
        return {
            log: logger,
            error: logger,
        };
    }
    return logger;
}
