"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { uploadImageToS3, UploadResult } from "@/lib/aws"
import { Upload, X } from "lucide-react"
import { getAuthToken } from "@/lib/auth-utils"

export function EditProfileModal({ open, onClose, currentUser, onProfileUpdated }: any) {
  const [name, setName] = useState(currentUser?.name || "")
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.profilePhoto || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!open) return null 

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setMessage({ text: "Invalid file type. Only images are allowed.", type: "error" })
        return
      }
      const maxSize = 10 * 1024 * 1024 
      if (file.size > maxSize) {
        setMessage({ text: "File size too large. Maximum size is 10MB.", type: "error" })
        return
      }
      
      setSelectedFile(file)
      setMessage({ text: "", type: "" })
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!hasChanges) return 

    setLoading(true)
    setMessage({ text: "", type: "" })
    
    let finalProfilePhoto = profilePhoto

    try {
      if (selectedFile) {
        setUploadingImage(true)
        const uploadResult: UploadResult = await uploadImageToS3(selectedFile)
        
        if (uploadResult.success && uploadResult.url) {
          finalProfilePhoto = uploadResult.url
        } else {
          throw new Error(uploadResult.error || "Image upload failed")
        }
        setUploadingImage(false)
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          name,
          profilePhoto: finalProfilePhoto,
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
    selectedFile !== null ||
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
            <p className="text-sm text-muted-foreground mb-2">Profile Photo</p>
            <div className="space-y-3">
              {(profilePhoto || selectedFile) && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-border">
                  <img 
                    src={selectedFile ? URL.createObjectURL(selectedFile) : profilePhoto} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedFile ? "Change Photo" : "Upload Photo"}
                </Button>
                
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={uploadingImage}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            
              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              
              {uploadingImage && (
                <p className="text-xs text-blue-500">Uploading image...</p>
              )}
              
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Or paste image URL:</p>
                <Input
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  placeholder="Paste image URL"
                />
              </div>
            </div>
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
          <Button onClick={handleSave} disabled={loading || uploadingImage || !hasChanges}>
            {loading || uploadingImage ? (uploadingImage ? "Uploading..." : "Saving...") : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
