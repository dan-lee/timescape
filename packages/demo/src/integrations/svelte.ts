import { mount, unmount } from "svelte";
import Demo from "./demo.svelte";

export const renderTo = (container: HTMLElement) => {
  const app = mount(Demo, { target: container });

  return () => {
    void unmount(app);
  };
};
