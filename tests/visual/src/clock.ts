/**
 * Freezes the clock so date-driven components (Calendar, DatePicker,
 * TimePicker, Statistic, ...) render the same value on every run and on every
 * platform.
 *
 * - `new Date()` / `Date.now()` return the fixed instant.
 * - `new Date(value)` keeps parsing normally.
 *
 * Test-environment normalisation only; production code is untouched.
 */

const DEFAULT_ISO = '2026-04-15T10:30:00+08:00';

export function freezeClock(iso: string = DEFAULT_ISO): void {
  const RealDate = Date as unknown as DateConstructor;
  const target = globalThis as unknown as { Date: DateConstructor };

  function MockDate(this: unknown, ...args: unknown[]): Date {
    const dateArgs = args.length === 0 ? [iso] : args;
    const instance = new (RealDate as unknown as new (...a: unknown[]) => Date)(...dateArgs);
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  MockDate.prototype = Object.create(RealDate.prototype);
  Object.setPrototypeOf(MockDate, RealDate);
  MockDate.now = () => new RealDate(iso).getTime();
  MockDate.parse = RealDate.parse.bind(RealDate);
  MockDate.UTC = RealDate.UTC.bind(RealDate);
  MockDate.current = () => RealDate.now();

  target.Date = MockDate as unknown as DateConstructor;
}

/** Fixed timezone for the whole suite - matches the unit test baseline. */
export const TEST_TIMEZONE = 'Asia/Singapore';
