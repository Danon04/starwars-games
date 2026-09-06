export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateMasterCode(digits: number[]): string {
  const shuffled = shuffleArray(digits);
  return shuffled.join('');
}

export function generateDigits(): { puzzle: number; planets: number; memory: number } {
  return {
    puzzle: Math.floor(Math.random() * 10),
    planets: Math.floor(Math.random() * 10),
    memory: Math.floor(Math.random() * 10),
  };
}
