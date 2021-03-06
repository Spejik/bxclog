export interface IBXCLogOptions {
    /**
     * Any locale.
     *
     * Use "auto" to set automatically
     *
     * eg. en-GB, de-DE, en-US
     */
    locale?: string | "auto";
    /**
     * Any timezone.
     *
     * Use "auto" to set automatically
     *
     * https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
     */
    timeZone?: string | "auto";
    /**
     * Which type of brackets to use
     */
    brackets?: "round" | "parentheses" | "()" | "square" | "box" | "[]" | "braces" | "curly" | "{}" | "angle" | "chevrons" | "<>";
    /**
     * Should the log be saved into a file?
     */
    saveToFile?: boolean;
    /**
     * Where should the file be stored.
     *
     * SaveToFile must be enabled for this to have effect.
     *
     * Relative to the entry file (eg. index.js).
     *
     * eg. `"../logs"`
     */
    saveFilePath?: string;
    /**
     * Changes whether debug entires are shown.
     *
     * Should be changed by the value of an environment variable.
     *
     * eg. `environment == "release"`
     */
    showDebug?: boolean;
}
export declare class BXCLog {
    private options;
    private bracketsStart;
    private bracketsClose;
    private dateFormatTime;
    private dateFormatDate;
    private filePath;
    constructor(_options?: IBXCLogOptions);
    debug(service: string, ...data: any[]): void;
    info(service: string, ...data: any[]): void;
    warn(service: string, ...data: any[]): void;
    error(service: string, ...data: any[]): void;
    private setDateTimeFormats;
    private setBracketsType;
    setFilePath(): void;
    private wrapString;
    private doLog;
}
