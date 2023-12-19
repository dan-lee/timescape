import type { Meta, StoryObj } from '@storybook/react'
import { createLiveStory } from './utils'

export default {
  title: 'root/timescape',
  component: () => null,
  parameters: {
    layout: 'centered',
    options: {
      showPanel: true,
    },
  },
} satisfies Meta

export const Full: StoryObj = {
  name: 'Full date time example',
  ...createLiveStory(
    await import('./source/full.source.tsx?raw').then((m) => m.default),
  ),
}

export const FullWithOptions: StoryObj = {
  name: 'Full with options',
  ...createLiveStory(
    await import('./source/full-options.source.tsx?raw').then((m) => m.default),
  ),
}

export const TimeWithOptions: StoryObj = {
  name: 'Time only with options',
  ...createLiveStory(
    await import('./source/time-only.source.tsx?raw').then((m) => m.default),
  ),
}

export const Steps: StoryObj = {
  name: 'Steps',
  ...createLiveStory(
    await import('./source/steps.source.tsx?raw').then((m) => m.default),
  ),
}

export const Calendar: StoryObj = {
  name: 'Calendar',
  ...createLiveStory(
    await import('./source/calendar.source.tsx?raw').then((m) => m.default),
  ),
}

export const Range: StoryObj = {
  name: 'Range',
  ...createLiveStory(
    await import('./source/range.source.tsx?raw').then((m) => m.default),
  ),
}

export const RangeCalendar: StoryObj = {
  name: 'Range Calendar',
  ...createLiveStory(
    await import('./source/calendar-range.source.tsx?raw').then(
      (m) => m.default,
    ),
  ),
}

export const Placeholder: StoryObj = {
  name: 'Placeholder',
  ...createLiveStory(
    await import('./source/placeholder.source.tsx?raw').then((m) => m.default),
  ),
}
