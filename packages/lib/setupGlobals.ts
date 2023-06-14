// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any
// https://github.com/vitest-dev/vitest/issues/1575#issuecomment-1439286286
export const setup = () => {
  process.env.TZ = 'UTC'
}
