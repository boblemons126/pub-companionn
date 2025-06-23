"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Trophy,
  Clock,
  DollarSign,
  ArrowRight,
  Zap,
  Target,
  UserPlus,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface User {
  name: string
  avatar?: string
}

interface RecentSession {
  id: string
  name: string
  date: string
  duration: string
  drinks: number
  spent: number
  venue: string
  type: "solo" | "group"
  participants?: number
}

interface ActiveSession {
  id: string
  name: string
  startTime: string
  duration: string
  venue: string
  drinks: number
  spent: number
  type: "solo" | "group"
  participants?: number
}

export default function Dashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User>({ name: "User" })
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)
  const [greeting, setGreeting] = useState("Hello")

  // Mock data - in real app this would come from your database
  const [stats] = useState({
    totalSessions: 12,
    totalDrinks: 45,
    totalSpent: 234.5,
    favoriteVenue: "The Red Lion",
    averageSessionLength: "2h 30m",
    thisWeekSessions: 2,
  })

  const [recentSessions] = useState<RecentSession[]>([
    {
      id: "1",
      name: "Friday Night Out",
      date: "2 days ago",
      duration: "3h 30m",
      drinks: 5,
      spent: 32.5,
      venue: "O'Malley's",
      type: "group",
      participants: 4,
    },
    {
      id: "2",
      name: "After Work Drinks",
      date: "1 week ago",
      duration: "1h 45m",
      drinks: 2,
      spent: 12.0,
      venue: "The Crown",
      type: "solo",
    },
    {
      id: "3",
      name: "Saturday Session",
      date: "2 weeks ago",
      duration: "4h 15m",
      drinks: 6,
      spent: 45.0,
      venue: "The Red Lion",
      type: "group",
      participants: 3,
    },
  ])

  const [friendsOnline] = useState([
    { id: "1", name: "Sam", avatar: "/placeholder.svg?height=32&width=32", status: "At The Crown" },
    { id: "2", name: "Jordan", avatar: "/placeholder.svg?height=32&width=32", status: "Planning night out" },
    { id: "3", name: "Alex", avatar: "/placeholder.svg?height=32&width=32", status: "Online" },
  ])

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return "Good morning"
      if (hour < 17) return "Good afternoon"
      return "Good evening"
    }
    setGreeting(getGreeting())

    if (status === "authenticated" && session) {
      setUser({
        name: session.user?.name || "User",
        avatar: session.user?.image || undefined,
      })
    }

    // Check for active session from localStorage (can be refactored later)
    const savedSession = localStorage.getItem("activeSession")
    if (savedSession) {
      setActiveSession(JSON.parse(savedSession))
    }
  }, [session, status])

  const startNewSession = (type: "solo" | "group") => {
    if (type === "group") {
      router.push("/sessions?type=group")
    } else {
      router.push("/sessions?type=solo")
    }
  }

  const continueSession = () => {
    router.push("/tracker")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍻</div>
          <div className="text-xl font-bold">Pub Companion</div>
          <div className="text-sm text-purple-200 mt-2">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto p-4 max-w-md pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {greeting}, {user.name}! 👋
            </h1>
            <p className="text-purple-200 text-sm">Ready for your next adventure?</p>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-600 text-white">{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        {/* Active Session Alert */}
        {activeSession && (
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur border-green-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-semibold">Active Session</span>
                </div>
                <Badge className="bg-green-500/20 text-green-300">LIVE</Badge>
              </div>
              <div className="mt-2">
                <h3 className="font-semibold">{activeSession.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activeSession.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {activeSession.venue}
                  </span>
                </div>
              </div>
              <Button onClick={continueSession} className="w-full mt-3 bg-green-600 hover:bg-green-700">
                Continue Session
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {!activeSession && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button onClick={() => startNewSession("solo")} className="h-20 bg-blue-600 hover:bg-blue-700 flex-col">
              <Play className="h-6 w-6 mb-2" />
              <span className="text-sm">Create Session</span>
            </Button>
            <Button
              onClick={() => startNewSession("group")}
              className="h-20 bg-purple-600 hover:bg-purple-700 flex-col"
            >
              <UserPlus className="h-6 w-6 mb-2" />
              <span className="text-sm">Add A Group</span>
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <div className="text-xs text-gray-300">Total Sessions</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">£{stats.totalSpent.toFixed(0)}</div>
              <div className="text-xs text-gray-300">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* This Week Progress */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-yellow-400" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sessions</span>
              <span className="font-bold">{stats.thisWeekSessions}/3 goal</span>
            </div>
            <Progress value={(stats.thisWeekSessions / 3) * 100} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <div className="font-bold text-blue-400">{stats.averageSessionLength}</div>
                <div className="text-gray-400">Avg Duration</div>
              </div>
              <div>
                <div className="font-bold text-yellow-400">{stats.favoriteVenue}</div>
                <div className="text-gray-400">Favorite Spot</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Friends Online */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                Friends Online
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/groups")}
                className="text-blue-400 hover:text-blue-300"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {friendsOnline.slice(0, 3).map((friend) => (
              <div key={friend.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs bg-green-600">{friend.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">{friend.name}</div>
                  <div className="text-xs text-gray-400">{friend.status}</div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                Recent Sessions
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/sessions")}
                className="text-blue-400 hover:text-blue-300"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSessions.slice(0, 2).map((session) => (
              <div key={session.id} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{session.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{session.date}</span>
                      <span>•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{session.venue}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white/5 border-white/20">
                    {session.type === "group" ? `${session.participants} people` : "Solo"}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div>
                    <div className="font-bold text-blue-400">{session.duration}</div>
                    <div className="text-gray-500">Duration</div>
                  </div>
                  <div>
                    <div className="font-bold text-yellow-400">{session.drinks}</div>
                    <div className="text-gray-500">Drinks</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-400">£{session.spent}</div>
                    <div className="text-gray-500">Spent</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-400" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Most Active Day</div>
                <div className="text-xs text-gray-300">Fridays are your favorite!</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Achievement Unlocked</div>
                <div className="text-xs text-gray-300">Visited 5 different venues this month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Navigation />
      </div>
    </div>
  )
}
