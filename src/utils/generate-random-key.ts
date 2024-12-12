export function generateRandomKey(size: number): string {
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTWXYZ0123456789';
  let output: string = '';
  for (let i = 0; i < size; i++) {
    const r: number = Math.floor(Math.random() * characters.length);
    output += characters[r];
  }
  return output;
}
