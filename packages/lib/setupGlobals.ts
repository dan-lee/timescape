// biome-ignore lint/suspicious/noExplicitAny: not declared in this context
declare const process: any;
// https://github.com/vitest-dev/vitest/issues/1575#issuecomment-1439286286
export const setup = () => {
  process.env.TZ = "UTC";
};
