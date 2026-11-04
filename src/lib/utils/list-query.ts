export type SearchParamValue = string | string[] | undefined;
export type SearchParamsRecord = Record<string, SearchParamValue>;

export function readSearchParam(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function readPositiveInteger(
  value: SearchParamValue,
  fallback = 1
): number {
  const parsed = Number.parseInt(readSearchParam(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function readEnumSearchParam<const T extends readonly string[]>(
  value: SearchParamValue,
  options: T,
  fallback: T[number]
): T[number] {
  const candidate = readSearchParam(value);
  return options.includes(candidate) ? (candidate as T[number]) : fallback;
}

export function buildQueryString(
  values: Record<string, string | undefined>
): string {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}
