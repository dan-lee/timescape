import { createApp } from "vue";
import Demo from "./demo.vue";

export const renderTo = (element: HTMLElement) => {
  const app = createApp(Demo);
  app.mount(element);

  return () => app.unmount();
};
