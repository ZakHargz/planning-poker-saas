const adjectives = ['Happy', 'Clever', 'Brave', 'Calm', 'Eager', 'Gentle', 'Jolly', 'Kind', 'Lively', 'Proud']
const nouns = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Fox', 'Owl', 'Lion', 'Wolf', 'Bear', 'Hawk']

export function generateRandomName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective}${noun}`
}
