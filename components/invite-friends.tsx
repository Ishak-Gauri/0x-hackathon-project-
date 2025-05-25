"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { UserPlus, X, Mail } from "lucide-react"

export function InviteFriends() {
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addEmail = () => {
    const email = currentEmail.trim()
    if (!email) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (emails.includes(email)) {
      toast.error("Email already added")
      return
    }

    setEmails([...emails, email])
    setCurrentEmail("")
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addEmail()
    }
  }

  const sendInvitations = async () => {
    if (emails.length === 0) {
      toast.error("Please add at least one email address")
      return
    }

    setIsLoading(true)

    try {
      const promises = emails.map((email) =>
        fetch("/api/invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, message }),
        }),
      )

      const results = await Promise.allSettled(promises)
      const successful = results.filter((result) => result.status === "fulfilled").length
      const failed = results.length - successful

      if (successful > 0) {
        toast.success(`${successful} invitation${successful > 1 ? "s" : ""} sent successfully!`)
        setEmails([])
        setMessage("")
      }

      if (failed > 0) {
        toast.error(`${failed} invitation${failed > 1 ? "s" : ""} failed to send`)
      }
    } catch (error) {
      console.error("Error sending invitations:", error)
      toast.error("Failed to send invitations")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>Invite Friends to PeerConnect</span>
        </CardTitle>
        <CardDescription>
          Invite your friends to join the student networking platform and start building connections together.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Addresses</Label>
          <div className="flex space-x-2">
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addEmail} variant="outline">
              Add
            </Button>
          </div>
        </div>

        {/* Email List */}
        {emails.length > 0 && (
          <div className="space-y-2">
            <Label>Added Emails ({emails.length})</Label>
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <Badge key={email} variant="secondary" className="flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>{email}</span>
                  <button onClick={() => removeEmail(email)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Personal Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Add a personal message to your invitation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Send Button */}
        <Button onClick={sendInvitations} disabled={emails.length === 0 || isLoading} className="w-full">
          {isLoading ? "Sending Invitations..." : `Send ${emails.length} Invitation${emails.length !== 1 ? "s" : ""}`}
        </Button>
      </CardContent>
    </Card>
  )
}
