"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess(false)

    try {
      // In a real implementation, you would update the profile via API
      // await updateUserProfile(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUpdateSuccess(true)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-teal-600 hover:text-teal-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </div>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

            <Tabs defaultValue="general">
              <TabsList className="mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      {updateSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                          Profile updated successfully!
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md min-h-[100px]"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Course Updates</h3>
                          <p className="text-sm text-gray-500">Receive notifications about course updates</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Assignment Reminders</h3>
                          <p className="text-sm text-gray-500">Get reminders about upcoming assignments</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Discussion Replies</h3>
                          <p className="text-sm text-gray-500">Be notified when someone replies to your comments</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Marketing Emails</h3>
                          <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                        </div>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
