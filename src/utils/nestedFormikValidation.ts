export function getNestedField<T>(path: string, object: any): T | undefined {
  const keys = path.split('.');
  let current: any = object;

  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}
