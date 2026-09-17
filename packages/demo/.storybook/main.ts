import type { StorybookConfig } from "@storybook/react-vite";
import { getCodeEditorStaticDirs } from "storybook-addon-code-editor/getStaticDirs";
import { getIntegrationVersionDefines } from "./vite.shared.ts";

const config = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../dist", ...getCodeEditorStaticDirs()],
  addons: ["storybook-addon-code-editor"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  features: {
    interactions: false,
    actions: false,
    backgrounds: false,
    outline: false,
    measure: false,
    viewport: false,
    controls: false,
  },
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    define: {
      ...viteConfig.define,
      ...getIntegrationVersionDefines(),
    },
  }),
} satisfies StorybookConfig;

export default config;
