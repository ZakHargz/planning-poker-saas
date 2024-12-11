import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface HostSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (isPlaying: boolean, sizingOption: 'fibonacci' | 'tshirt') => void
  initialIsPlaying: boolean
  initialSizingOption: 'fibonacci' | 'tshirt'
}

export function HostSettingsModal({ isOpen, onClose, onSave, initialIsPlaying, initialSizingOption }: HostSettingsModalProps) {
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying)
  const [sizingOption, setSizingOption] = useState<'fibonacci' | 'tshirt'>(initialSizingOption)

  const handleSave = () => {
    onSave(isPlaying, sizingOption)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Host Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="host-playing" className="flex flex-col space-y-1">
              <span>Participate in voting</span>
              <span className="font-normal text-sm text-muted-foreground">
                Toggle to participate in or observe the voting process
              </span>
            </Label>
            <Switch
              id="host-playing"
              checked={isPlaying}
              onCheckedChange={setIsPlaying}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="sizing-option">Sizing Option</Label>
            <Select value={sizingOption} onValueChange={(value: 'fibonacci' | 'tshirt') => setSizingOption(value)}>
              <SelectTrigger id="sizing-option">
                <SelectValue placeholder="Select sizing option" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="fibonacci">Fibonacci</SelectItem>
                <SelectItem value="tshirt">T-Shirt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

