"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Play,
  Pause,
  Square,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Beer,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Trophy,
} from "lucide-react"

interface Session {
  id: string
  name: string
  type: "solo" | "group"
  status: "active" | "paused" | "completed"
  startTime: string
  endTime?: string
  duration: string
  venue: string
  drinks: number
  spent: number
  groupId?: string
  groupName?: string
  participants?: number
}

export default function Sessions() {
  const router = useRouter()
  const [showNewSession, setShowNewSession] = useState(false)
  const [sessionType, setSessionType] = useState<"solo" | "group">("solo")
  const [selectedGroup, setSelectedGroup] = useState("")

  const [sessions] = useState<Session[]>([
    {
      id: "1",
      name: "Saturday Night Out",
      type: "group",
      status: "active",
      startTime: "19:45",
      duration: "2h 15m",
      venue: "The Red Lion",
      drinks: 3,
      spent: 18.5,
      groupId: "1",
      groupName: "Saturday Night Crew",
      participants: 4,
    },
    {
      id: "2",
      name: "Quick After Work",
      type: "solo",
      status: "completed",
      startTime: "17:30",
      endTime: "19:15",
      duration: "1h 45m",
      venue: "The Crown",
      drinks: 2,
      spent: 12.0,
    },
    {
      id: "3",
      name: "Friday Celebration",
      type: "group",
      status: "completed",
      startTime: "20:00",
      endTime: "23:30",
      duration: "3h 30m",
      venue: "O'Malley's",
      drinks: 5,
      spent: 32.5,
      groupId: "1",
      groupName: "Saturday Night Crew",
      participants: 3,
    },
  ])

  const activeSession = sessions.find((s) => s.status === "active")
  const completedSessions = sessions.filter((s) => s.status === "completed")

  const groups = [
    { id: "1", name: "Saturday Night Crew" },
    { id: "2", name: "Work Drinks" },
  ]

  const startNewSession = () => {
    // Here you would create a new session
    console.log("Starting new session:", { type: sessionType, group: selectedGroup })
    setShowNewSession(false)
    router.push("/") // Go to main tracker
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300"
      case "paused":
        return "bg-yellow-500/20 text-yellow-300"
      case "completed":
        return "bg-gray-500/20 text-gray-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-3 w-3" />
      case "paused":
        return <Pause className="h-3 w-3" />
      case "completed":
        return <Square className="h-3 w-3" />
      default:
        return <Square className="h-3 w-3" />
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
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-purple-200 text-sm">Track your drinking sessions</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Calendar className="h-4 w-4 mx-auto mb-1 text-blue-400" />
              <div className="text-lg font-bold">{sessions.length}</div>
              <div className="text-xs text-gray-300">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Play className="h-4 w-4 mx-auto mb-1 text-green-400" />
              <div className="text-lg font-bold">{sessions.filter((s) => s.status === "active").length}</div>
              <div className="text-xs text-gray-300">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Beer className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
              <div className="text-lg font-bold">{sessions.reduce((sum, s) => sum + s.drinks, 0)}</div>
              <div className="text-xs text-gray-300">Drinks</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-400" />
              <div className="text-lg font-bold">£{sessions.reduce((sum, s) => sum + s.spent, 0).toFixed(0)}</div>
              <div className="text-xs text-gray-300">Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Session */}
        {activeSession && (
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur border-green-500/30 mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-400" />
                  Active Session
                </CardTitle>
                <Badge className="bg-green-500/20 text-green-300">LIVE</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{activeSession.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="h-4 w-4" />
                  {activeSession.venue}
                  {activeSession.type === "group" && (
                    <>
                      <span>•</span>
                      <Users className="h-4 w-4" />
                      {activeSession.participants} people
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">{activeSession.duration}</div>
                  <div className="text-xs text-gray-400">Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{activeSession.drinks}</div>
                  <div className="text-xs text-gray-400">Drinks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">£{activeSession.spent}</div>
                  <div className="text-xs text-gray-400">Spent</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/")}>
                  Continue Session
                </Button>
                <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start New Session */}
        <Dialog open={showNewSession} onOpenChange={setShowNewSession}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6 bg-blue-600 hover:bg-blue-700 h-12">
              <Play className="h-5 w-5 mr-2" />
              Start New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Start New Session</DialogTitle>
              <DialogDescription className="text-gray-400">Choose how you want to track tonight</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Session Type</Label>
                <Select value={sessionType} onValueChange={(value: "solo" | "group") => setSessionType(value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo Session</SelectItem>
                    <SelectItem value="group">Group Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {sessionType === "group" && (
                <div>
                  <Label>Select Group</Label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Choose a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setShowNewSession(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={startNewSession} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Start Session
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Recent Sessions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Sessions</h2>
          {completedSessions.map((session) => (
            <Card key={session.id} className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{session.name}</h3>
                      <Badge className={getStatusColor(session.status)}>
                        {getStatusIcon(session.status)}
                        {session.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                      <Clock className="h-4 w-4" />
                      {session.startTime}
                      {session.endTime && ` - ${session.endTime}`}
                      <span>•</span>
                      <MapPin className="h-4 w-4" />
                      {session.venue}
                    </div>
                    {session.type === "group" && (
                      <div className="flex items-center gap-1 text-xs text-blue-300">
                        <Users className="h-3 w-3" />
                        {session.groupName} ({session.participants} people)
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-blue-400">{session.duration}</div>
                    <div className="text-gray-400">Duration</div>
                  </div>
                  <div>
                    <div className="font-bold text-yellow-400">{session.drinks}</div>
                    <div className="text-gray-400">Drinks</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-400">£{session.spent}</div>
                    <div className="text-gray-400">Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Session Insights */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Session Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 rounded">
                <div className="text-lg font-bold text-blue-400">2.5h</div>
                <div className="text-xs text-gray-400">Avg Duration</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded">
                <div className="text-lg font-bold text-yellow-400">3.3</div>
                <div className="text-xs text-gray-400">Avg Drinks</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-500/20 rounded">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <div className="flex-1">
                <div className="font-semibold">Longest Session</div>
                <div className="text-sm text-gray-300">Friday Celebration - 3h 30m</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
