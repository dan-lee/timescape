import { ChangeEvent } from 'react';

export declare const $NOW: "$NOW";

export declare type $NOW = typeof $NOW;

declare type Callback<T> = (arg: T) => void | typeof STOP_EVENT_PROPAGATION;

declare type DateCallbacks = {
    onDateChange?: (date: Date | null) => void;
    onInputChange?: (date: Date | null, details: InputChangeDetails) => void;
    /** Called once focus leaves all of the date's inputs. */
    onBlur?: () => void;
};

/**
 * `null` is an empty date, `undefined` is no date at all -- passing `date` as
 * `undefined` leaves the input uncontrolled. Same distinction React Aria and
 * MUI draw for their date fields.
 */
declare type DateProp = Date | null | undefined;

export declare type DateType = "days" | "months" | "years" | "hours" | "minutes" | "seconds" | "milliseconds" | "am/pm";

declare type Events = {
    changeDate: Date | undefined;
    changeInput: InputChangeDetails & {
        date: Date | undefined;
    };
    focusWrap: "start" | "end";
    blur: undefined;
};

declare type HookOptions = Omit<Options_2, "date"> & DateCallbacks & {
    /** Controlled value. `null` is the empty date, `undefined` means uncontrolled. */
    date?: DateProp;
    defaultDate?: DateProp;
};

declare type HookRangeOptions = {
    from?: HookOptions;
    to?: HookOptions;
};

export declare type InputChangeDetails = {
    state: InputState;
};

export declare type InputPropsOptions = {
    ref?: Ref<HTMLInputElement>;
    autoFocus?: boolean;
    /** @deprecated Use the React-style `autoFocus` option instead. */
    autofocus?: boolean;
};

export declare type InputState = "empty" | "partial" | "complete";

declare type Options_2 = {
    date?: Date;
    minDate?: Date | $NOW;
    maxDate?: Date | $NOW;
    hour12?: boolean;
    digits?: "numeric" | "2-digit";
    wrapAround?: boolean;
    snapToStep?: boolean;
    wheelControl?: boolean;
    disallowPartial?: boolean;
};

declare type ReactOptions = HookOptions;
export { ReactOptions as Options }
export { ReactOptions }

declare type ReactRangeOptions = HookRangeOptions;
export { ReactRangeOptions as RangeOptions }
export { ReactRangeOptions }

declare type Ref<T> = ((element: T | null) => unknown) | {
    current: T | null;
} | null;

export declare type RootPropsOptions = {
    /** Focusing the root focuses the first input. */
    ref?: Ref<HTMLElement>;
};

declare const STOP_EVENT_PROPAGATION: unique symbol;

declare class TimescapeManager implements Options_2 {
    #private;
    minDate?: Options_2["minDate"];
    maxDate?: Options_2["maxDate"];
    hour12?: Options_2["hour12"];
    digits?: Options_2["digits"];
    wrapAround?: Options_2["wrapAround"];
    snapToStep?: Options_2["snapToStep"];
    wheelControl?: Options_2["wheelControl"];
    disallowPartial?: Options_2["disallowPartial"];
    ampm?: "am" | "pm";
    get date(): Date | undefined;
    set date(nextDate: Date | number | string | undefined);
    constructor(initialDate?: Date, options?: Options_2);
    resync(): void;
    registerRoot(element: HTMLElement): void;
    registerElement(element: HTMLInputElement, type: DateType, autofocus?: boolean, domExists?: boolean): HTMLInputElement | undefined;
    /**
     * Returns whether all fields are filled out. Can only be false in partial mode.
     * @returns {boolean}
     */
    isCompleted(): boolean;
    remove(): void;
    focusField(which?: number | DateType): void;
    on<E extends keyof Events>(event: E, callback: Callback<Events[E]>): () => void;
    /* Excluded from this release type: setRangeBound */
}

export declare const useTimescape: (options?: HookOptions) => {
    readonly _manager: TimescapeManager;
    readonly getInputProps: (type: DateType, opts?: InputPropsOptions) => {
        type: "text";
        role: "spinbutton";
        autoComplete: "off";
        enterKeyHint: "next";
        spellCheck: false;
        autoCapitalize: "off";
        tabIndex: 0;
        "data-timescape-input": "";
        inputMode: "numeric" | undefined;
        autoFocus: boolean | undefined;
        ref: (element: HTMLInputElement | null) => void;
    };
    readonly getRootProps: (opts?: RootPropsOptions) => {
        role: "group";
        tabIndex: -1;
        ref: (element: HTMLElement | null) => void;
    };
    readonly focusField: (type?: DateType) => void;
    readonly ampm: {
        readonly value: "am" | "pm" | undefined;
        set: (value: "am" | "pm") => void;
        toggle: () => void;
        getSelectProps: () => {
            value: "am" | "pm" | undefined;
            onChange: (e: Event | ChangeEvent<HTMLSelectElement>) => void;
        };
    };
};

export declare const useTimescapeRange: (options?: HookRangeOptions) => {
    readonly getRootProps: (opts?: RootPropsOptions) => {
        role: "group";
        tabIndex: -1;
        ref: (element: HTMLElement | null) => void;
    };
    readonly from: {
        readonly getInputProps: (type: DateType, opts?: InputPropsOptions) => {
            type: "text";
            role: "spinbutton";
            autoComplete: "off";
            enterKeyHint: "next";
            spellCheck: false;
            autoCapitalize: "off";
            tabIndex: 0;
            "data-timescape-input": "";
            inputMode: "numeric" | undefined;
            autoFocus: boolean | undefined;
            ref: (element: HTMLInputElement | null) => void;
        };
        readonly focusField: (type?: DateType) => void;
        readonly ampm: {
            readonly value: "am" | "pm" | undefined;
            set: (value: "am" | "pm") => void;
            toggle: () => void;
            getSelectProps: () => {
                value: "am" | "pm" | undefined;
                onChange: (e: Event | ChangeEvent<HTMLSelectElement>) => void;
            };
        };
    };
    readonly to: {
        readonly getInputProps: (type: DateType, opts?: InputPropsOptions) => {
            type: "text";
            role: "spinbutton";
            autoComplete: "off";
            enterKeyHint: "next";
            spellCheck: false;
            autoCapitalize: "off";
            tabIndex: 0;
            "data-timescape-input": "";
            inputMode: "numeric" | undefined;
            autoFocus: boolean | undefined;
            ref: (element: HTMLInputElement | null) => void;
        };
        readonly focusField: (type?: DateType) => void;
        readonly ampm: {
            readonly value: "am" | "pm" | undefined;
            set: (value: "am" | "pm") => void;
            toggle: () => void;
            getSelectProps: () => {
                value: "am" | "pm" | undefined;
                onChange: (e: Event | ChangeEvent<HTMLSelectElement>) => void;
            };
        };
    };
};

export { }
