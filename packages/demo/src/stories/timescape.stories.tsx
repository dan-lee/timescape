import type { Meta, StoryObj } from "@storybook/react-vite";
import { createLiveStory } from "./utils";

export default {
  title: "root/timescape",
  component: () => null,
  parameters: {
    layout: "centered",
    controls: { disable: true },
  },
} satisfies Meta;

export const Full = {
  name: "Full date time example",
  ...createLiveStory(
    await import("./source/full.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const FullWithOptions = {
  name: "Full with options",
  ...createLiveStory(
    await import("./source/full-options.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const TimeWithOptions = {
  name: "Time only with options",
  ...createLiveStory(
    await import("./source/time-only.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const Steps = {
  name: "Steps",
  ...createLiveStory(
    await import("./source/steps.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const Calendar = {
  name: "Calendar",
  ...createLiveStory(
    await import("./source/calendar.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const Range = {
  name: "Range",
  ...createLiveStory(
    await import("./source/range.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const RangeCalendar = {
  name: "Range Calendar",
  ...createLiveStory(
    await import("./source/calendar-range.source.tsx?raw").then(
      (m) => m.default,
    ),
  ),
} satisfies StoryObj;

export const Placeholder = {
  name: "Placeholder",
  ...createLiveStory(
    await import("./source/placeholder.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const Partial = {
  name: "Partial Input",
  ...createLiveStory(
    await import("./source/partial.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const Milliseconds = {
  name: "Milliseconds",
  ...createLiveStory(
    await import("./source/milliseconds.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;

export const CustomAmPm = {
  name: "Custom AM/PM Controls",
  ...createLiveStory(
    await import("./source/custom-ampm.source.tsx?raw").then((m) => m.default),
  ),
} satisfies StoryObj;
