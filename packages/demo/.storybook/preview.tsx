import type { Parameters } from "@storybook/react-vite";
import { setupMonaco } from "storybook-addon-code-editor";

setupMonaco({
  onMonacoLoad(monaco) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'timescape/react' {${__TIMESCAPE_REACT_TYPES__}}`,
      "inmemory://model/timescape-react.d.ts",
    );
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module '*.css'; declare module '*';`,
      "inmemory://model/timescape.css.d.ts",
    );
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
    });
    monaco.editor.setTheme("vs-dark");
  },
});

export const parameters: Parameters = {
  options: {
    // @ts-expect-error - storySort is not typed
    storySort: (a, b) => b.title.localeCompare(a.title),
  },
  actions: { disable: true },
};
