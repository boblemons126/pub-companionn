"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Shield, Smartphone, Trash2, Download, Upload, ArrowLeft, Edit, Save, Camera, Wrench } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function Settings() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    age: "25",
    weight: "70",
    gender: "male",
    emergencyContact: "Sarah (Sister)",
    emergencyPhone: "+44 7123 456789",
    avatar: "/placeholder.svg?height=80&width=80",
  })

  const [preferences, setPreferences] = useState({
    bacWarnings: true,
    hydrationReminders: true,
    spendingLimits: false,
    locationSharing: true,
    pushNotifications: true,
    soundEffects: true,
    darkMode: true,
    dataSharing: false,
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem("pubCompanionUser")
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUserData(parsed)
      if (parsed.safetyPreferences) {
        setPreferences({ ...preferences, ...parsed.safetyPreferences })
      }
    }
  }, [])

  const saveSettings = () => {
    const updatedUser = { ...userData, safetyPreferences: preferences }
    localStorage.setItem("pubCompanionUser", JSON.stringify(updatedUser))
    setIsEditing(false)
  }

  const exportData = () => {
    const data = {
      user: userData,
      preferences,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pub-companion-data.json"
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto p-4 max-w-md pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-purple-200 text-sm">Manage your account and preferences</p>
          </div>
          {isEditing && (
            <Button onClick={saveSettings} size="sm" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>

        {/* Quick Setup Access */}
        <Button onClick={() => router.push("/setup")} className="w-full mb-6 bg-purple-600 hover:bg-purple-700 h-12">
          <Wrench className="h-5 w-5 mr-2" />
          Advanced Setup & Preferences
        </Button>

        {/* Profile Section */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-400 hover:text-blue-300"
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg">{userData.name}</h3>
                    <p className="text-sm text-gray-300">Member since Jan 2024</p>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={userData.age}
                    onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={userData.weight}
                    onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safety Settings */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              Safety & Health
            </CardTitle>
            <CardDescription className="text-gray-300">Configure safety features and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bac-warnings">BAC Warnings</Label>
                <p className="text-sm text-gray-400">Get alerts when BAC is high</p>
              </div>
              <Switch
                id="bac-warnings"
                checked={preferences.bacWarnings}
                onCheckedChange={(checked) => setPreferences({ ...preferences, bacWarnings: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hydration">Hydration Reminders</Label>
                <p className="text-sm text-gray-400">Regular water break notifications</p>
              </div>
              <Switch
                id="hydration"
                checked={preferences.hydrationReminders}
                onCheckedChange={(checked) => setPreferences({ ...preferences, hydrationReminders: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="spending">Spending Limits</Label>
                <p className="text-sm text-gray-400">Alert when spending too much</p>
              </div>
              <Switch
                id="spending"
                checked={preferences.spendingLimits}
                onCheckedChange={(checked) => setPreferences({ ...preferences, spendingLimits: checked })}
              />
            </div>

            {/* Emergency Contact */}
            <div className="pt-4 border-t border-white/10">
              <Label>Emergency Contact</Label>
              {isEditing ? (
                <div className="space-y-2 mt-2">
                  <Input
                    value={userData.emergencyContact}
                    onChange={(e) => setUserData({ ...userData, emergencyContact: e.target.value })}
                    placeholder="Contact name"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    value={userData.emergencyPhone}
                    onChange={(e) => setUserData({ ...userData, emergencyPhone: e.target.value })}
                    placeholder="Phone number"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              ) : (
                <div className="mt-2 p-3 bg-white/5 rounded">
                  <div className="font-medium">{userData.emergencyContact}</div>
                  <div className="text-sm text-gray-400">{userData.emergencyPhone}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-400" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-sm text-gray-400">Receive app notifications</p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location">Location Sharing</Label>
                <p className="text-sm text-gray-400">Share location with friends</p>
              </div>
              <Switch
                id="location"
                checked={preferences.locationSharing}
                onCheckedChange={(checked) => setPreferences({ ...preferences, locationSharing: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sounds">Sound Effects</Label>
                <p className="text-sm text-gray-400">Play sounds for actions</p>
              </div>
              <Switch
                id="sounds"
                checked={preferences.soundEffects}
                onCheckedChange={(checked) => setPreferences({ ...preferences, soundEffects: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={exportData} variant="outline" className="flex-1 bg-white/5 border-white/20 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="flex-1 bg-white/5 border-white/20 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-sharing">Anonymous Analytics</Label>
                <p className="text-sm text-gray-400">Help improve the app</p>
              </div>
              <Switch
                id="data-sharing"
                checked={preferences.dataSharing}
                onCheckedChange={(checked) => setPreferences({ ...preferences, dataSharing: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-500/10 backdrop-blur border-red-500/30 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Pub Companion</h3>
            <p className="text-sm text-gray-400 mb-2">Version 1.0.0</p>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Support</span>
            </div>
          </CardContent>
        </Card>

        <Navigation />
      </div>
    </div>
  )
}
