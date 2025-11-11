// Lightweight logger utility to keep logs consistent
// Uses console under the hood but adds prefixes and timestamps

const ts = () => new Date().toISOString();

export const logger = {
  info: (...args) => console.log(`[INFO  ${ts()}]`, ...args),
  warn: (...args) => console.warn(`[WARN  ${ts()}]`, ...args),
  error: (...args) => console.error(`[ERROR ${ts()}]`, ...args),
  debug: (...args) => {
    if (process.env.DEBUG) console.debug(`[DEBUG ${ts()}]`, ...args);
  },
};

export default logger;
