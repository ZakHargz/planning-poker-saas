"use client"

import { Card, CardContent } from "@/components/ui/card";
import { ShareButton } from "./_components/share-button";
import { useState, useEffect, useCallback, use } from 'react'
import Pusher from 'pusher-js'
import { Button } from "@/components/ui/button";
import { generateRandomName } from "@/lib/random-name";
import { Toaster } from "@/components/ui/toaster";
import { HostSettingsModal } from "./_components/host-settings";
import { Badge } from "@/components/ui/badge";
import { UserCog, UserMinus, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { UsernameModal } from "./_components/username-modal";
import { Logo } from "./_components/logo";
import { VotingChart } from "./_components/voting-chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface User {
  name: string;
  value: number | string | null;
  isActive: boolean;
  isPlaying: boolean;
  connected: boolean
}

export default function Room({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const [users, setUsers] = useState<{ [key: string]: User }>({})
  const [selectedValue, setSelectedValue] = useState<number | string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [userName, setUserName] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHostSettingsOpen, setIsHostSettingsOpen] = useState(false)
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
  const [sizingOption, setSizingOption] = useState<'fibonacci' | 'tshirt'>('fibonacci')
  const [, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let storedName = localStorage.getItem('userName')
    const storedIsHost = localStorage.getItem('isHost') === 'true'

    if (!storedName) {
      storedName = generateRandomName()
      localStorage.setItem('userName', storedName)
    }

    setUserName(storedName)
    setIsHost(storedIsHost)
    setIsPlaying(true)

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe(`room-${roomId}`)

    channel.bind('pusher:subscription_succeeded', () => {
      fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: roomId, name: storedName, isPlaying: true, isHost: storedIsHost }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.isHost !== undefined) {
            setIsHost(data.isHost)
            localStorage.setItem('isHost', data.isHost.toString())
          }
        })

      fetch(`/api/users?roomId=${roomId}`)
        .then(response => response.json())
        .then(data => {
          setUsers(data.users)
          if (data.host === storedName) {
            setIsHost(true)
            localStorage.setItem('isHost', 'true')
          }
        })
        .catch(error => console.error('Error fetching users:', error))
    })

    channel.bind('user_joined', (data: { name: string, isPlaying: boolean }) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [data.name]: {
          name: data.name,
          value: null,
          isActive: true,
          isPlaying: data.isPlaying,
          connected: true
        }
      }))
    })

    channel.bind('user_left', (data: { name: string }) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers }
        delete newUsers[data.name]
        return newUsers
      })
    })

    channel.bind('user_kicked', (data: { name: string }) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers }
        delete newUsers[data.name]
        return newUsers
      })
      if (data.name === storedName) {
        toast({
          title: "You've been kicked from the room",
          description: "The host has removed you from the session.",
          variant: "destructive",
        })
        setTimeout(() => window.location.href = '/', 3000)
      }
    })

    channel.bind('vote', (data: { name: string; value: number | string | null }) => {
      if (data && typeof data === 'object' && 'name' in data && 'value' in data) {
        setUsers((prevUsers) => ({
          ...prevUsers,
          [data.name]: { ...prevUsers[data.name], value: data.value, isActive: true }
        }))
      }
    })

    channel.bind('toggle_playing', (data: { name: string; isPlaying: boolean }) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [data.name]: { ...prevUsers[data.name], isPlaying: data.isPlaying, value: null }
      }))
    })

    channel.bind('username_changed', (data: { oldName: string; newName: string }) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers }
        if (newUsers[data.oldName]) {
          newUsers[data.newName] = { ...newUsers[data.oldName], name: data.newName }
          delete newUsers[data.oldName]
        }
        return newUsers
      })
      if (data.oldName === storedName) {
        setUserName(data.newName)
        localStorage.setItem('userName', data.newName)
      }
    })

    channel.bind('user_disconnected', (data: { name: string }) => {
      handleUserDisconnect(data.name)
    })

    channel.bind('reveal', () => setRevealed(true))
    channel.bind('reset', () => {
      setUsers((prevUsers) => {
        const newUsers: { [key: string]: User } = {}
        Object.keys(prevUsers).forEach(key => {
          newUsers[key] = { ...prevUsers[key], value: null }
        })
        return newUsers
      })
      setSelectedValue(null)
      setRevealed(false)
    })

    channel.bind('pusher:error', (err: { message: any; }) => {
      setError(`Connection error: ${err.message}`)
    })

    return () => {
      fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: roomId, name: storedName }),
      })
      pusher.unsubscribe(`room-${roomId}`)
    }
  }, [roomId, toast])

  const handleHostSettingsSave = useCallback((newIsPlaying: boolean, newSizingOption: 'fibonacci' | 'tshirt') => {
    setIsPlaying(newIsPlaying)
    setSizingOption(newSizingOption)
    handleTogglePlaying(newIsPlaying)
  }, [])

  const handleVote = async (value: number | string) => {
    if (!isPlaying) return
    setSelectedValue(value)
    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomId, name: userName, value }),
    })
  }

  const handleReveal = async () => {
    await fetch('/api/reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomId }),
    })
  }

  const handleReset = async () => {
    await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomId }),
    })
  }

  const handleTogglePlaying = async (newIsPlaying: boolean) => {
    setIsPlaying(newIsPlaying)
    await fetch('/api/toggle-playing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomId, name: userName, isPlaying: newIsPlaying }),
    })
  }

  const handleKickUser = async (name: string) => {
    if (!isHost) return;
    await fetch('/api/kick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomId, name }),
    })
  }

  const getVotes = () => {
    return Object.values(users)
      .filter((user): user is User & { value: number | string } =>
        user.isActive && user.isPlaying && (typeof user.value === 'number' || typeof user.value === 'string')
      )
      .map(user => user.value)
  }

  const handleUsernameChange = async (newUsername: string) => {
    if (newUsername !== userName) {
      const oldName = userName
      setUserName(newUsername)
      localStorage.setItem('userName', newUsername)
      await fetch('/api/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: roomId, oldName, newName: newUsername }),
      })
    }
    setIsUsernameModalOpen(false)
  }

  const handleUserDisconnect = useCallback((name: string) => {
    setUsers((prevUsers) => ({
      ...prevUsers,
      [name]: { ...prevUsers[name], connected: false }
    }))
  }, [])

  const calculateAverage = () => {
    if (sizingOption === 'tshirt') return 'N/A'
    const values = Object.values(users).filter((user): user is User & { value: number } => user.isActive && user.isPlaying && typeof user.value === 'number').map(user => user.value)
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo />
            <h1 className="text-2xl font-bold">Planning Poker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setIsUsernameModalOpen(true)}>
              <UserCog className="h-4 w-4 mr-2" /> Change Username
            </Button>
            <ShareButton roomId={roomId} />
            {isHost && (
              <Button onClick={() => setIsHostSettingsOpen(true)} variant="outline" size="sm"> Host Settings</Button>
            )}
            <div className="flex justify-center items-center space-x-2 text-xs">
              <Switch checked={isPlaying} onCheckedChange={handleTogglePlaying} id="playing-mode" />
              <label htmlFor="playing-mode">
                {isPlaying ? 'Playing' : 'Sitting Out'}
              </label>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-8">
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl">
          <TooltipProvider>
            {Object.entries(users).map(([userId, user]) => (
              <Tooltip key={userId}>
                <TooltipTrigger asChild>
                  <Card className={`w-24 h-36 flex flex-col items-center justify-center cursor-pointer ${user.isPlaying ? (user.value ? 'bg-primary text-primary-foreground' : 'bg-secondary') : 'opacity-50'} ${isHost && !user.connected ? 'border-red-500 border-2' : ''} ${user.name === userName && isHost ? 'border-blue-500 border-2' : ''}`}>
                    <CardContent className="text-center p-2">
                      <p className="font-bold truncate w-full">{user.name}</p>
                      {revealed ? (<p className="text-2xl font-bold mt-2">{user.value ?? '-'}</p>) : (user.value && <p className="text-2xl font-bold mt-2">✓</p>)}
                      {user.name === userName && <Badge variant="outline" className="mt-2">You</Badge>}
                      {isHost && !user.connected && <WifiOff className="h-4 w-4 text-red-500 mt-2" />}
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.name}</p>
                  {isHost && !user.connected && <p className="text-red-500">Disconnected</p>}
                  {isHost && user.name !== userName && (
                    <Button variant="destructive" size="sm" onClick={() => handleKickUser(user.name)} className="mt-2" ><UserMinus className="h-4 w-4 mr-2" />Kick User</Button>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {!revealed && (
          <div className="flex justify-center space-x-2 flex-wrap max-w-2xl">
            {sizingOption === 'fibonacci' ? (
              fibonacciSequence.map((value) => (
                <Button key={value} onClick={() => handleVote(value)} variant={selectedValue === value ? "default" : "outline"} disabled={!isPlaying} className="w-12 h-12 m-1">{value}</Button>
              ))
            ) : (
              tshirtSizes.map((size) => (
                <Button key={size} onClick={() => handleVote(size)} variant={selectedValue === size ? "default" : "outline"} disabled={!isPlaying} className="w-12 h-12 m-1" > {size}</Button>
              ))
            )}
          </div>
        )}

        {revealed && (
          <VotingChart votes={getVotes()} average={calculateAverage()} />
        )}

        <div className="flex justify-center space-x-4">
          <Button onClick={handleReveal} disabled={revealed || !isHost}>Reveal Votes</Button>
          <Button onClick={handleReset} disabled={!isHost} variant="outline">Reset</Button>
        </div>
      </main>

      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Scrum Planning Poker. All rights reserved.</p>
      </footer>

      <HostSettingsModal isOpen={isHostSettingsOpen} onClose={() => setIsHostSettingsOpen(false)} onSave={handleHostSettingsSave} initialIsPlaying={isPlaying} initialSizingOption={sizingOption} />
      <UsernameModal isOpen={isUsernameModalOpen} onClose={handleUsernameChange} initialUsername={userName} />
      <Toaster />
    </div>
  )
}
