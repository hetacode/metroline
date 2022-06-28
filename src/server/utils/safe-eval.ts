import { Env } from '../ci-config/ci-config';

export function safeEval(expression: string, env: Env): any {
  const safeThis = {};
  const whitelist = ['Math', 'Array', 'Number', 'undefined', 'Boolean', 'String', 'RegExp'];
  const properties = Object.getOwnPropertyNames(globalThis).filter(f => !whitelist.some(w => w === f));
  properties.forEach(p => {
    safeThis[p] = undefined;
  });

  // eslint-disable-next-line dot-notation
  safeThis['env'] = env;

  // eslint-disable-next-line no-new-func
  return (new Function(`with(this) { ${expression} }`)).call(safeThis);
}
