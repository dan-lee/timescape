import * as rehookify from "@rehookify/datepicker";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import * as timescape from "timescape/react";
import * as CalendarComponent from "./calendar";
import * as SetOptions from "./SetOptions";
import * as styles from "./timescape.css";
import * as UpdateFlasher from "./UpdateFlasher.tsx";

export const createLiveStory = (code: string) => {
  const story = {};

  makeLiveEditStory(story, {
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

  return story;
};
