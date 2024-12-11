import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  const { name } = await request.json()
  const roomId = uuidv4()

  // Set up the initial room with the creator as the host
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, name, isPlaying: true, isHost: true }),
  })

  return NextResponse.json({ roomId, name, isHost: true })
}