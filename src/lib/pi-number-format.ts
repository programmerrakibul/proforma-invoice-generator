export const GENERATED_PI_NUMBER_PATTERN = /^MMF-\d{4}-\d{3}$/;

export function isGeneratedPiNumber(value: string): boolean {
  return GENERATED_PI_NUMBER_PATTERN.test(value);
}
