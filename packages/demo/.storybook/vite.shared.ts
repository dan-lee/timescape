import { execFileSync } from "node:child_process";

const integrationPackages = [
  "react",
  "preact",
  "svelte",
  "solid-js",
  "vue",
] as const;

type ListedPackage = {
  dependencies?: Record<string, { version: string }>;
};

export const getIntegrationVersionDefines = () => {
  const output = execFileSync(
    "pnpm",
    ["--filter", "demo", "list", ...integrationPackages, "--json"],
    { encoding: "utf8" },
  );
  const [workspacePackage] = JSON.parse(output) as ListedPackage[];

  return Object.fromEntries(
    Object.entries(workspacePackage?.dependencies ?? {}).map(
      ([name, details]) => [
        `__VERSION_${name.toUpperCase().replaceAll("-", "_")}__`,
        JSON.stringify(details.version),
      ],
    ),
  );
};
