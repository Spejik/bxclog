"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BXCLog = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
/**
 * Default constructor options
 */
const BXCLogDefaultOptions = {
    locale: "auto",
    timeZone: "auto",
    brackets: "square",
    saveToFile: false,
    saveFilePath: "logs",
    showDebug: true,
};
class BXCLog {
    constructor(_options = BXCLogDefaultOptions) {
        // Class options
        // Object.create is used here to not overwrite the original constant
        this.options = Object.create(BXCLogDefaultOptions);
        // Brackets that will be used for logging
        this.bracketsStart = "[";
        this.bracketsClose = "]";
        // Where the log file is stored
        this.filePath = "";
        const __ = "[BXCLog] ";
        const notAvailable = "not available in this environment";
        if (!Intl) {
            throw new Error(`${__}Internationalization is ${notAvailable}`);
        }
        if (!Intl.DateTimeFormat().resolvedOptions().locale) {
            throw new Error(`${__}Locales are ${notAvailable}`);
        }
        if (!Intl.DateTimeFormat().resolvedOptions().timeZone) {
            throw new Error(`${__}Time zones are ${notAvailable}`);
        }
        const IntlOptions = Intl.DateTimeFormat().resolvedOptions();
        // Assign the new properties to the default settings
        Object.assign(this.options, _options);
        if (this.options.locale == "auto")
            this.options.locale = IntlOptions.locale;
        if (this.options.timeZone == "auto")
            this.options.timeZone = IntlOptions.timeZone;
        this.setDateTimeFormats();
        this.setBracketsType();
        // If saving to a file is enabled, get the path of the file
        if (this.options.saveToFile) {
            this.setFilePath();
            // Create the parent directories just in case the other functions don't
            fs_1.default.mkdirSync(path_1.default.dirname(this.filePath), { recursive: true });
        }
    }
    debug(service, ...data) {
        if (!this.options.showDebug)
            return;
        this.doLog("debug", service, ...data);
    }
    info(service, ...data) {
        this.doLog("info", service, ...data);
    }
    warn(service, ...data) {
        this.doLog("warn", service, ...data);
    }
    error(service, ...data) {
        this.doLog("error", service, ...data);
    }
    setDateTimeFormats() {
        const locale = this.options.locale;
        const timezone = this.options.timeZone;
        if (Intl.DateTimeFormat.supportedLocalesOf([locale ?? ""]).length <= 0)
            throw new Error("[BXCLog] [Intl:DateTimeFormat] Unsupported locale - " + locale);
        try {
            this.dateFormatTime = Intl.DateTimeFormat(locale, {
                timeZone: timezone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            this.dateFormatDate = Intl.DateTimeFormat(locale, {
                timeZone: timezone,
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            });
        }
        catch (e) {
            throw new Error("[BXCLog] [Intl:DateTimeFormat] " + e);
        }
    }
    setBracketsType() {
        const bracketsType = this.options.brackets ?? "square";
        const bracketsLookup = {
            "round": ["(", ")"],
            "square": ["[", "]"],
            "curly": ["{", "}"],
            "angle": ["<", ">"],
            get "parentheses"() { return this.round; },
            get "()"() { return this.round; },
            get "box"() { return this.square; },
            get "[]"() { return this.square; },
            get "braces"() { return this.curly; },
            get "{}"() { return this.curly; },
            get "chevrons"() { return this.angle; },
            get "<>"() { return this.angle; },
        };
        if (bracketsType in bracketsLookup) {
            this.bracketsStart = bracketsLookup[bracketsType][0];
            this.bracketsClose = bracketsLookup[bracketsType][1];
        }
        else {
            this.bracketsStart = "[";
            this.bracketsClose = "]";
        }
    }
    setFilePath() {
        let entryPath = require.main?.path ?? ".";
        let filePath = this.options.saveFilePath ?? "logs";
        let date = this.dateFormatDate.format(new Date());
        // add "/" to the end of the path if missing
        if (!entryPath?.endsWith(path_1.default.sep))
            entryPath += path_1.default.sep;
        if (!filePath?.endsWith(path_1.default.sep))
            filePath += path_1.default.sep;
        // If the time is separated with `\`, `/`, replace it with a dot
        if (date.includes("\\") || date.includes("/"))
            date = date.replace(/\\\//g, ".");
        date = date.replace(/\s/g, '');
        this.filePath =
            path_1.default.resolve(entryPath +
                filePath +
                date +
                ".bxc.log");
    }
    wrapString(s) {
        return this.bracketsStart + s + this.bracketsClose;
    }
    doLog(type, _service, ...data) {
        const now = new Date();
        const date = "".concat(this.dateFormatDate.format(now).replace(/\s/g, ''), " ", this.dateFormatTime.format(now).replace(/\s/g, ''));
        _service = _service.trim();
        let service = _service;
        // A lookup table is much faster than a switch or if-else
        const colorsLookup = {
            "debug": cli_color_1.default.green,
            "info": cli_color_1.default.blue,
            "warn": cli_color_1.default.yellow,
            "error": cli_color_1.default.red
        };
        if (type in colorsLookup) {
            service = colorsLookup[type](service);
        }
        else {
            service = cli_color_1.default.magenta(service);
        }
        console.log("", this.wrapString(date), this.wrapString(service), ...data);
        if (this.options.saveToFile) {
            fs_1.default.appendFileSync(this.filePath, [this.wrapString(date), `(${type})`, this.wrapString(_service), ...data, "\n"].join(" "));
        }
    }
}
exports.BXCLog = BXCLog;
