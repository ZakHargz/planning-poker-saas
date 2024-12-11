import { NextResponse } from 'next/server'

const rooms: {
  [roomId: string]: {
    host: string,
    users: { [userId: string]: { name: string, isPlaying: boolean } }
  }
} = {}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('roomId')

  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
  }

  const room = rooms[roomId] || { host: '', users: {} }

  return NextResponse.json({ host: room.host, users: room.users })
}

export async function POST(request: Request) {
  const { roomId, name, isPlaying, isHost } = await request.json()

  if (!roomId || !name) {
    return NextResponse.json({ error: 'Room ID and name are required' }, { status: 400 })
  }

  if (!rooms[roomId]) {
    rooms[roomId] = { host: isHost ? name : '', users: {} }
  }

  rooms[roomId].users[name] = { name, isPlaying: isPlaying || false }

  return NextResponse.json({ success: true, isHost: rooms[roomId].host === name })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('roomId')
  const name = searchParams.get('name')

  if (!roomId || !name) {
    return NextResponse.json({ error: 'Room ID and name are required' }, { status: 400 })
  }

  if (rooms[roomId] && rooms[roomId].users && rooms[roomId].users[name]) {
    delete rooms[roomId].users[name]
  }

  return NextResponse.json({ success: true })
}
