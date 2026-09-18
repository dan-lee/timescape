import { Icon } from "@iconify-icon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import SolidLogo from "./SolidLogo";

const styles = {
  iframe: "absolute left-0 top-0 h-full w-full",
  badge:
    "absolute left-5 top-5 flex cursor-default flex-row items-center gap-2 rounded-[12px] bg-white/80 p-[15px] shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px]",
  badgeVersion: "translate-y-[2px] text-[11px] text-[#666]",
  info: "absolute bottom-5 left-5 flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-full border border-[#ccc] text-[14px] text-white shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] before:pointer-events-none before:absolute before:bottom-1/2 before:left-full before:w-[275px] before:translate-x-[3px] before:translate-y-[-12px] before:rounded-[10px] before:rounded-bl-[2px] before:bg-white/80 before:px-5 before:py-[10px] before:leading-[1.5] before:text-[#484848] before:opacity-0 before:shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] before:transition-all before:duration-200 before:content-[attr(data-text)] hover:before:pointer-events-auto hover:before:opacity-100",
};

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
    controls: { disable: true },
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
