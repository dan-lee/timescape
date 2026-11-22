import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createHooks, type HookOptions, type HookRangeOptions } from "./hooks";

export {
  $NOW,
  type DateType,
  type InputChangeDetails,
  type InputState,
} from "../index";
export type { InputPropsOptions, RootPropsOptions } from "./hooks";

export type ReactOptions = HookOptions;
export type ReactRangeOptions = HookRangeOptions;
export type { ReactOptions as Options, ReactRangeOptions as RangeOptions };

export const { useTimescape, useTimescapeRange } = createHooks({
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
});
