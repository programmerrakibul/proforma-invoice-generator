export const GENERATED_PI_NUMBER_PATTERN = /^MMF-\d{6}-\d{4}$/;

export function isGeneratedPiNumber(value: string): boolean {
  return GENERATED_PI_NUMBER_PATTERN.test(value);
}
