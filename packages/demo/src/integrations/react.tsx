import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ReactDemo } from "./demo.react.tsx";

export const renderTo = (container: HTMLElement) => {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ReactDemo />
    </StrictMode>,
  );

  return () => requestAnimationFrame(() => root.unmount());
};
