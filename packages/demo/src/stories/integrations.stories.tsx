import { Icon } from "@iconify-icon/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import SolidLogo from "./SolidLogo";
import * as styles from "./integrations.css";

type Integration = "react" | "preact" | "solid" | "svelte" | "vue" | "vanilla";
const Badge = ({ integration }: { integration: Integration }) => {
  switch (integration) {
    case "react":
      return (
        <div className={styles.badge}>
          <Icon
            icon="carbon:logo-react"
            height={24}
            style={{ color: "rgb(20, 158, 202)" }}
          />

          <span>React</span>
          <span className={styles.badgeVersion}>v{__VERSION_REACT__}</span>
        </div>
      );
    case "preact":
      return (
        <div className={styles.badge}>
          <Icon icon="vscode-icons:file-type-preact" height={24} />
          <span>Preact</span>
          <span className={styles.badgeVersion}>v{__VERSION_PREACT__}</span>
        </div>
      );
    case "solid":
      return (
        <div className={styles.badge}>
          <SolidLogo style={{ height: 24, width: "auto" }} />
          <span>Solid.js</span>
          <span className={styles.badgeVersion}>v{__VERSION_SOLID_JS__}</span>
        </div>
      );
    case "svelte":
      return (
        <div className={styles.badge}>
          <Icon icon="vscode-icons:file-type-svelte" height={24} />
          <span>Svelte</span>
          <span className={styles.badgeVersion}>v{__VERSION_SVELTE__}</span>
        </div>
      );
    case "vue":
      return (
        <div className={styles.badge}>
          <Icon icon="vscode-icons:file-type-vue" height={24} />
          <span>Vue</span>
          <span className={styles.badgeVersion}>v{__VERSION_VUE__}</span>
        </div>
      );
    case "vanilla":
      return (
        <div className={styles.badge}>
          <span>Vanilla</span>
          <Icon icon="vscode-icons:file-type-js-official" height={24} />
        </div>
      );
  }
};

const IframeComponent = ({ integration }: { integration: Integration }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const src = import.meta.env.DEV
    ? `http://localhost:4949/integrations.html?value=${integration}`
    : `./integrations.html?value=${integration}`;

  return (
    <div>
      <iframe
        title={`${integration} integration demo`}
        role="presentation"
        src={src}
        className={styles.iframe}
      />
      <Badge integration={integration} />
      <div
        className={styles.info}
        data-text="The integration examples are rendered in an iframe with their respective framework and therefore doesn't provide live code edit. Check out the timescape stories where this is possible."
      >
        ?
      </div>
    </div>
  );
};

export default {
  title: "root/integrations",
  component: () => null,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

const createStory = (integration: Integration, code: string): StoryObj => {
  const story: StoryObj = {};
  makeLiveEditStory(story, {
    code,
    modifyEditor: ({ editor }) => {
      editor.getEditors().at(0)?.updateOptions({ readOnly: true });
    },
  });

  story.render = () => <IframeComponent integration={integration} />;

  return story;
};

const [react, preact, solid, svelte, vue, vanilla] = await Promise.all([
  import("../integrations/demo.react.tsx?raw").then((m) => m.default),
  import("../integrations/preact.ts?raw").then((m) => m.default),
  import("../integrations/solid.ts?raw").then((m) => m.default),
  import("../integrations/demo.svelte?raw").then((m) => m.default),
  import("../integrations/demo.vue?raw").then((m) => m.default),
  import("../integrations/vanilla.ts?raw").then((m) => m.default),
]);

export const React = createStory("react", react);
export const Preact = createStory("preact", preact);
export const Solid = createStory("solid", solid);
export const Svelte = createStory("svelte", svelte);
export const Vue = createStory("vue", vue);
export const Vanilla = createStory("vanilla", vanilla);
