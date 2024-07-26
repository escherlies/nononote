/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

export const logger = {
  info: (message?: any, ...optionalParams: any[]) =>
    console.log(message, ...optionalParams),
  error: (message?: any, ...optionalParams: any[]) =>
    console.error(message, ...optionalParams),
  warn: (message?: any, ...optionalParams: any[]) =>
    console.warn(message, ...optionalParams),
  debug: (message?: any, ...optionalParams: any[]) =>
    console.debug(message, ...optionalParams),
}
