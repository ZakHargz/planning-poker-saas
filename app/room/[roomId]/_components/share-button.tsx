"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface ShareButtonProps {
  roomId: string
}

export function ShareButton({ roomId }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = async () => {
    const inviteLink = `${window.location.origin}/room/${roomId}`
    try {
      await navigator.clipboard.writeText(inviteLink)
      setIsCopied(true)
      toast({ title: "Link copied!", description: "The invite link has been copied to your clipboard." })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error(error)
      toast({ title: "Copy failed", description: "Pleae try again or copy the link manually", variant: "destructive" })
    }
  }

  return (
    <Button onClick={copyToClipboard} variant={"outline"} size={"sm"}>
      {isCopied ? (
        <><Check className="mr-2 size-4" />Copied </>
      ) : (
        <><Copy className="mr-2 size-4" />Share</>
      )}
    </Button>
  )
}
