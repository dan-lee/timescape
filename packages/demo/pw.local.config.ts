import base from "./playwright.config";
base.use = { ...(base.use ?? {}), launchOptions: { executablePath: "/opt/pw-browsers/chromium" } };
base.reporter = "dot";
export default base;
