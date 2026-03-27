export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

export function std(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance =
    values.reduce((acc, value) => {
      const diff = value - m;
      return acc + diff * diff;
    }, 0) / values.length;
  return Math.sqrt(variance);
}

export function coefficientOfVariation(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  if (m === 0) return 0;
  return (std(values) / m) * 100;
}
