import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { createHooks, type HookOptions, type HookRangeOptions } from "./hooks";

export {
  $NOW,
  type DateType,
  type InputChangeDetails,
  type InputState,
} from "../index";
export type { InputPropsOptions, RootPropsOptions } from "./hooks";

export type PreactOptions = HookOptions;
export type PreactRangeOptions = HookRangeOptions;
export type { PreactOptions as Options, PreactRangeOptions as RangeOptions };

export const { useTimescape, useTimescapeRange } = createHooks({
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
});
