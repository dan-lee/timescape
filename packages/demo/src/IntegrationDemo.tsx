// Check out the './integrations' folder for the demo code of the different integrations

import { useEffect, useRef } from "react";
import "./IntegrationDemo.css";

declare global {
  interface Window {
    date?: Date;
  }
}

const IntegrationDemo = () => {
  const renderTargetRef = useRef<HTMLDivElement>(null);
  const unmountRef = useRef(() => {});
  const searchParams = new URLSearchParams(window.location.search);
  const integration = searchParams.get("value");
  const date = searchParams.get("date");

  useEffect(() => {
    if (!date) return;

    window.date = new Date(Number.isNaN(Number(date)) ? date : Number(date));
  }, [date]);

  useEffect(() => {
    if (!integration) return;

    unmountRef.current?.();

    const ext = integration === "react" ? "tsx" : "ts";
    import(`./integrations/${integration}.${ext}`)
      .then(({ renderTo }) => {
        if (!renderTargetRef.current) return;
        unmountRef.current = renderTo(renderTargetRef.current);
      })
      .catch((err) => {
        console.error("Failed to load integration", err);
      });
  }, [integration]);

  return <div ref={renderTargetRef} />;
};

export default IntegrationDemo;
