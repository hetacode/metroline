import { ExcludeCondition, IncludeCondition, TagCondition } from '../ci-config';

function emptyArray<T>(arr: T[]) {
  return (
    !arr
    || !(arr instanceof Array)
    || arr.length === 0
  );
}

function canExecIfIncludes(tag: string, patterns: string[]): boolean {
  if (emptyArray(patterns)) {
    return true;
  }
  return patterns.some(pattern => tag.match(new RegExp(pattern)));
}

function canExecIfExcludes(tag: string, patterns: string[]): boolean {
  if (emptyArray(patterns)) {
    return true;
  }
  return patterns.every(pattern => !tag.match(new RegExp(pattern)));
}

export function canExecWhenTag(tag: string, condition: TagCondition): boolean {
  if ((condition as IncludeCondition)?.include) {
    return canExecIfIncludes(tag, (condition as IncludeCondition).include);
  }
  if ((condition as ExcludeCondition)?.exclude) {
    return canExecIfExcludes(tag, (condition as ExcludeCondition).exclude);
  }
  return canExecIfIncludes(tag, condition as string[]);
}
