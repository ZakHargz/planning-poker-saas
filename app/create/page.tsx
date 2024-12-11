"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function CreateRoom() {
  const [name, setName] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/create-room', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, isHost: true }) })
    const data = await response.json()
    localStorage.setItem('userName', name)
    localStorage.setItem('isHost', 'true')
    router.push(`/room/${data.roomId}`)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Create a new room</CardTitle>
          <CardDescription>Start a new planning session</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input id="name" placeholder="Enter your name / username" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Create room</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
