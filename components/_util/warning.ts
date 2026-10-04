// Module-scoped: bundlers replace `process.env.NODE_ENV` at build time, and
// declaring it here keeps the ambient out of the published global scope.
declare const process: { env: { NODE_ENV?: string } };

export default function warning(condition, message: string, ...extra) {
  if (process.env.NODE_ENV !== 'production' && console) {
    if (condition) {
      return console.error(
        `[@suzume-design/web-react]: ${message}`,
        extra ? { detail: extra } : undefined
      );
    }
  }
}
