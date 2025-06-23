"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Plus, Settings, Crown, MapPin, Calendar, ArrowLeft, MoreVertical } from "lucide-react"

interface Group {
  id: string
  name: string
  description: string
  members: Member[]
  isAdmin: boolean
  lastActive: string
  totalSessions: number
  avatar: string
}

interface Member {
  id: string
  name: string
  avatar: string
  role: "admin" | "member"
  status: "online" | "offline"
  joinDate: string
}

export default function Groups() {
  const router = useRouter()
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")

  const [groups] = useState<Group[]>([
    {
      id: "1",
      name: "Saturday Night Crew",
      description: "The original gang for weekend adventures",
      isAdmin: true,
      lastActive: "2 hours ago",
      totalSessions: 12,
      avatar: "/placeholder.svg?height=60&width=60",
      members: [
        {
          id: "1",
          name: "You",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "admin",
          status: "online",
          joinDate: "Jan 2024",
        },
        {
          id: "2",
          name: "Alex",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "member",
          status: "online",
          joinDate: "Jan 2024",
        },
        {
          id: "3",
          name: "Sam",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "member",
          status: "offline",
          joinDate: "Feb 2024",
        },
        {
          id: "4",
          name: "Jordan",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "member",
          status: "online",
          joinDate: "Feb 2024",
        },
      ],
    },
    {
      id: "2",
      name: "Work Drinks",
      description: "After work pub sessions with colleagues",
      isAdmin: false,
      lastActive: "1 week ago",
      totalSessions: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      members: [
        {
          id: "5",
          name: "Mike",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "admin",
          status: "offline",
          joinDate: "Mar 2024",
        },
        {
          id: "1",
          name: "You",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "member",
          status: "online",
          joinDate: "Mar 2024",
        },
        {
          id: "6",
          name: "Lisa",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "member",
          status: "offline",
          joinDate: "Mar 2024",
        },
      ],
    },
  ])

  const createGroup = () => {
    if (newGroupName.trim()) {
      // Here you would typically save to database
      console.log("Creating group:", { name: newGroupName, description: newGroupDescription })
      setShowCreateGroup(false)
      setNewGroupName("")
      setNewGroupDescription("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto p-4 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Friend Groups</h1>
            <p className="text-purple-200 text-sm">Manage your drinking crews</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-blue-400" />
              <div className="text-lg font-bold">{groups.length}</div>
              <div className="text-xs text-gray-300">Groups</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Crown className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
              <div className="text-lg font-bold">{groups.filter((g) => g.isAdmin).length}</div>
              <div className="text-xs text-gray-300">Admin</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-green-400" />
              <div className="text-lg font-bold">{groups.reduce((sum, g) => sum + g.totalSessions, 0)}</div>
              <div className="text-xs text-gray-300">Sessions</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Group Button */}
        <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6 bg-blue-600 hover:bg-blue-700 h-12">
              <Plus className="h-5 w-5 mr-2" />
              Create New Group
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription className="text-gray-400">
                Start a new friend group for your pub adventures
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Friday Night Crew"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="group-description">Description (Optional)</Label>
                <Input
                  id="group-description"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="What's this group about?"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCreateGroup(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={createGroup} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Groups List */}
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id} className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={group.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {group.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{group.name}</h3>
                      {group.isAdmin && <Crown className="h-4 w-4 text-yellow-400" />}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{group.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.members.length} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {group.totalSessions} sessions
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Members Preview */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 4).map((member) => (
                      <Avatar key={member.id} className="h-6 w-6 border-2 border-gray-800">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs bg-gray-600">{member.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group.members.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center">
                        <span className="text-xs">+{group.members.length - 4}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        group.members.some((m) => m.status === "online") ? "bg-green-400" : "bg-gray-400"
                      }`}
                    />
                    {group.members.filter((m) => m.status === "online").length} online
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => router.push(`/sessions?group=${group.id}`)}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Start Session
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    onClick={() => router.push(`/groups/${group.id}`)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>

                <div className="text-xs text-gray-400 mt-2">Last active: {group.lastActive}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {groups.length === 0 && (
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
              <p className="text-gray-300 mb-4">Create your first friend group to start tracking nights out together</p>
              <Button onClick={() => setShowCreateGroup(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
