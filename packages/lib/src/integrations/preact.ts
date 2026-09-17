import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { $NOW, type DateType } from "../index";
import { createHooks, type HookOptions, type HookRangeOptions } from "./hooks";

export {
  $NOW,
  type DateType,
  type PreactOptions as Options,
  type PreactRangeOptions as RangeOptions,
};

export type PreactOptions = HookOptions;
export type PreactRangeOptions = HookRangeOptions;

export const { useTimescape, useTimescapeRange } = createHooks({
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
});
