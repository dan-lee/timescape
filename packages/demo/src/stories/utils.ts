import * as rehookify from "@rehookify/datepicker";
import type { StoryObj } from "@storybook/react";
import { createLiveEditStory } from "storybook-addon-code-editor";
import * as timescape from "timescape/react";
import * as SetOptions from "./SetOptions";
import * as UpdateFlasher from "./UpdateFlasher.tsx";
import * as CalendarComponent from "./calendar";
import * as styles from "./timescape.css";

export const createLiveStory = (code: string): StoryObj => {
  const liveEdit = createLiveEditStory({
    code,
    availableImports: {
      "timescape/react": timescape,
      "@rehookify/datepicker": rehookify,
      "../SetOptions": SetOptions,
      "../UpdateFlasher": UpdateFlasher,
      "../calendar": CalendarComponent,
      "../timescape.css": styles,
    },
  });

  return { render: liveEdit, ...liveEdit };
};
