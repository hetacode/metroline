import { safeEval } from "./safe-eval";

describe('safeEval', () => {
  it('should some critical object should be undefined', async () => {
    const evals = [
      safeEval('return eval', {}),
      safeEval('return process', {}),
      safeEval('return console', {}),
      safeEval('return Function', {})
    ];
    evals.forEach(e => expect(e).toBeUndefined());
  });

  it('should some APIs should be accessible', async () => {
    const evals = [
      safeEval('return Math.abs(-2)', {}),
      safeEval('return RegExp("^test.*").test("test123")', {}),
      safeEval('return Number.isInteger(10)', {}),
      safeEval('return Array.of(1,2)', {}),
      safeEval('return String("test").toUpperCase()', {}),
      safeEval('return Boolean("test").valueOf()', {})
    ];

    expect(evals).toEqual([
      2,
      true,
      true,
      [1, 2],
      "TEST",
      true
    ]);
  });

  it('should be access to env variables', async () => {
    const se = safeEval('return this', { ENV1: "123", ENV2: "test" });
    expect(se).toMatchObject({ env: { ENV1: "123", ENV2: "test" } });
  });
});
