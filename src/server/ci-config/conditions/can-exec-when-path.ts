import { ExcludeCondition, IncludeCondition, PathCondition } from '../ci-config';

function emptyArray<T>(arr: T[]) {
  return (
    !arr
    || !(arr instanceof Array)
    || arr.length === 0
  );
}

function canExecIfIncludes(path: string[], patterns: string[]): boolean {
  if (emptyArray(patterns)) {
    return true;
  }
  return patterns.some(pattern => path.some(p => p.match(new RegExp(pattern))));
}

function canExecIfExcludes(path: string[], patterns: string[]): boolean {
  if (emptyArray(patterns)) {
    return true;
  }
  return patterns.every(pattern => !path.some(p => p.match(new RegExp(pattern))));
}

export function canExecWhenPath(path: string[], condition: PathCondition): boolean {
  if ((condition as IncludeCondition)?.include) {
    return canExecIfIncludes(path, (condition as IncludeCondition).include);
  }
  if ((condition as ExcludeCondition)?.exclude) {
    return canExecIfExcludes(path, (condition as ExcludeCondition).exclude);
  }
  return canExecIfIncludes(path, condition as string[]);
}
