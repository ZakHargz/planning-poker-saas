import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UsernameModalProps {
  isOpen: boolean
  onClose: (username: string) => void
  initialUsername: string
}

export function UsernameModal({ isOpen, onClose, initialUsername }: UsernameModalProps) {
  const [username, setUsername] = useState(initialUsername)

  useEffect(() => {
    setUsername(initialUsername)
  }, [initialUsername])

  const handleSave = () => {
    if (username.trim()) {
      onClose(username.trim())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(username)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Your Username</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              placeholder="Enter your username"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!username.trim()}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
