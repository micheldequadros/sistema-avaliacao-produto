/** URL de avatar DiceBear (SVG) determinístico para a seed (use o id da conta). */
export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e9e5fb`;
}
