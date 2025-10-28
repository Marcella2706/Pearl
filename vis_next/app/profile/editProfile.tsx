"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EditProfileModal({ open, onClose, currentUser, onProfileUpdated }: any) {
  const [name, setName] = useState(currentUser?.name || "")
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.profilePhoto || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" })

  if (!open) return null 

  const handleSave = async () => {
    if (!hasChanges) return 

    setLoading(true)
    setMessage({ text: "", type: "" })
    try {
      const res = await fetch(`http://localhost:2706/api/v1/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("__Pearl_Token")}`,
        },
        body: JSON.stringify({
          name,
          profilePhoto,
          currentPassword: currentPassword || null,
          newPassword: newPassword || null,
        }),
      })

      if (!res.ok) throw new Error("Failed to update profile")
      const data = await res.json()

      setMessage({ text: "Profile updated successfully!", type: "success" })
      onProfileUpdated(data)
      setTimeout(onClose, 1200)
    } catch (err: any) {
      setMessage({ text: err.message || "Error updating profile", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = !!currentUser && (
    name.trim() !== currentUser.name ||
    profilePhoto.trim() !== (currentUser.profilePhoto || "") ||
    (currentPassword.trim() !== "" && newPassword.trim() !== "")
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-foreground mb-4">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Name</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Profile Photo URL</p>
            <Input
              value={profilePhoto}
              onChange={(e) => setProfilePhoto(e.target.value)}
              placeholder="Paste image URL"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Change Password</p>
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        {message.text && (
          <p
            className={`mt-4 text-sm ${
              message.type === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !hasChanges}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
