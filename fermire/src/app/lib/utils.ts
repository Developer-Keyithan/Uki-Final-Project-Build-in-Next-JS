type ClassValue = string | null | undefined | boolean | { [key: string]: boolean };

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flatMap(input => {
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([value]) => value)
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(' ');
}