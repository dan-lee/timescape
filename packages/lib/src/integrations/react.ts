import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { $NOW, type DateType } from "../index";
import { createHooks, type HookOptions, type HookRangeOptions } from "./hooks";

export {
  $NOW,
  type DateType,
  type ReactOptions as Options,
  type ReactRangeOptions as RangeOptions,
};

export type ReactOptions = HookOptions;
export type ReactRangeOptions = HookRangeOptions;

export const { useTimescape, useTimescapeRange } = createHooks({
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
});
