import { ChangeEvent } from 'react';
import { RefObject } from 'react';

export declare const $NOW: "$NOW";

export declare type $NOW = typeof $NOW;

declare type Callback<T> = (arg: T) => void | typeof STOP_EVENT_PROPAGATION;

export declare type DateType = "days" | "months" | "years" | "hours" | "minutes" | "seconds" | "milliseconds" | "am/pm";

declare type Events = {
    changeDate: Date | undefined;
    focusWrap: "start" | "end";
};

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

declare type ReactOptions = Options_2 & {
    defaultDate?: Date | undefined;
    onChange?: (date: Date | undefined) => void;
};
export { ReactOptions as Options }
export { ReactOptions }

declare type ReactRangeOptions = {
    from?: ReactOptions;
    to?: ReactOptions;
};
export { ReactRangeOptions as RangeOptions }
export { ReactRangeOptions }

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
    focusField(which?: number): void;
    on<E extends keyof Events>(event: E, callback: Callback<Events[E]>): () => void;
}

export declare const useTimescape: (options?: ReactOptions) => {
    readonly _manager: TimescapeManager;
    readonly getInputProps: (type: DateType, opts?: {
        ref?: RefObject<HTMLInputElement | null>;
        autofocus?: boolean;
    }) => {
        ref: (element: HTMLInputElement | null) => void;
    };
    readonly getRootProps: () => {
        ref: (element: HTMLElement | null) => void;
    };
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

export declare const useTimescapeRange: (options?: ReactRangeOptions) => {
    readonly getRootProps: () => {
        ref: (element: HTMLElement | null) => void;
    };
    readonly from: {
        readonly getInputProps: (type: DateType, opts?: {
            ref?: RefObject<HTMLInputElement | null>;
            autofocus?: boolean;
        }) => {
            ref: (element: HTMLInputElement | null) => void;
        };
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
        readonly getInputProps: (type: DateType, opts?: {
            ref?: RefObject<HTMLInputElement | null>;
            autofocus?: boolean;
        }) => {
            ref: (element: HTMLInputElement | null) => void;
        };
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
