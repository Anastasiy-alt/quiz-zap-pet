const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // без похожих символов I, O, 0, 1

export function generateRoomCode(length = 6): string {
  return Array.from(
    { length },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
}
