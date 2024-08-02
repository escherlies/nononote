export const wrapDebugLog = (a: any, logFn: (a: any) => void) => {
  logFn(a);
  return a;
};
