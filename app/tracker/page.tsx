"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Beer,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Shield,
  Plus,
  Camera,
  Phone,
  Car,
  ArrowLeft,
  Pause,
  Square,
} from "lucide-react"

interface Drink {
  id: string
  name: string
  type: string
  alcohol: number
  price: number
  time: string
  venue: string
}

interface Friend {
  id: string
  name: string
  avatar: string
  drinks: number
  location: string
  status: "online" | "offline"
}

export default function Tracker() {
  const router = useRouter()
  const [drinks, setDrinks] = useState<Drink[]>([
    {
      id: "1",
      name: "Pint of Lager",
      type: "Beer",
      alcohol: 5.0,
      price: 4.5,
      time: "20:30",
      venue: "The Red Lion",
    },
  ])

  const [totalSpent, setTotalSpent] = useState(4.5)
  const [sessionStart] = useState("19:45")
  const [currentVenue, setCurrentVenue] = useState("The Red Lion")
  const [sessionName] = useState("Saturday Night Out")
  const [sessionType] = useState<"solo" | "group">("group")

  const friends: Friend[] = [
    {
      id: "1",
      name: "Alex",
      avatar: "/placeholder.svg?height=32&width=32",
      drinks: 3,
      location: "The Red Lion",
      status: "online",
    },
    {
      id: "2",
      name: "Sam",
      avatar: "/placeholder.svg?height=32&width=32",
      drinks: 2,
      location: "The Red Lion",
      status: "online",
    },
    {
      id: "3",
      name: "Jordan",
      avatar: "/placeholder.svg?height=32&width=32",
      drinks: 4,
      location: "The Crown",
      status: "offline",
    },
  ]

  const addDrink = (drinkType: string, price: number, alcohol: number) => {
    const newDrink: Drink = {
      id: Date.now().toString(),
      name: drinkType,
      type: drinkType.includes("Beer") ? "Beer" : drinkType.includes("Wine") ? "Wine" : "Spirit",
      alcohol,
      price,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      venue: currentVenue,
    }
    setDrinks([...drinks, newDrink])
    setTotalSpent((prev) => prev + price)
  }

  const endSession = () => {
    // Save session data and redirect to dashboard
    localStorage.removeItem("activeSession")
    router.push("/")
  }

  const pauseSession = () => {
    // Pause session logic
    console.log("Session paused")
  }

  const estimatedBAC = Math.min(drinks.length * 0.02, 0.15)
  const hydrationLevel = Math.max(100 - drinks.length * 15, 20)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto p-4 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{sessionName}</h1>
              <Badge className="bg-green-500/20 text-green-300">LIVE</Badge>
            </div>
            <p className="text-purple-200 text-sm">Started at {sessionStart}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={pauseSession}
              className="text-yellow-400 hover:bg-yellow-500/20"
            >
              <Pause className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={endSession} className="text-red-400 hover:bg-red-500/20">
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Beer className="h-6 w-6 mx-auto mb-1 text-yellow-400" />
              <div className="text-2xl font-bold">{drinks.length}</div>
              <div className="text-xs text-gray-300">Drinks</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-1 text-green-400" />
              <div className="text-2xl font-bold">£{totalSpent.toFixed(2)}</div>
              <div className="text-xs text-gray-300">Spent</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Clock className="h-6 w-6 mx-auto mb-1 text-blue-400" />
              <div className="text-2xl font-bold">2h 15m</div>
              <div className="text-xs text-gray-300">Duration</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Location */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-red-400" />
              <span className="font-semibold">{currentVenue}</span>
              <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-300">
                Checked In
              </Badge>
            </div>
            <p className="text-sm text-gray-300">123 High Street • 4.2 ⭐</p>
          </CardContent>
        </Card>

        {/* Quick Add Drinks */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Drink
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => addDrink("Pint of Beer", 4.5, 5.0)} className="bg-yellow-600 hover:bg-yellow-700">
                🍺 Pint £4.50
              </Button>
              <Button onClick={() => addDrink("Wine Glass", 6.0, 12.0)} className="bg-purple-600 hover:bg-purple-700">
                🍷 Wine £6.00
              </Button>
              <Button onClick={() => addDrink("Shot", 3.5, 40.0)} className="bg-red-600 hover:bg-red-700">
                🥃 Shot £3.50
              </Button>
              <Button onClick={() => addDrink("Cocktail", 8.0, 15.0)} className="bg-pink-600 hover:bg-pink-700">
                🍹 Cocktail £8.00
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Group Session (if applicable) */}
        {sessionType === "group" && (
          <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Session
              </CardTitle>
              <CardDescription className="text-gray-300">Saturday Night Crew</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{friend.name}</span>
                      <div
                        className={`w-2 h-2 rounded-full ${friend.status === "online" ? "bg-green-400" : "bg-gray-400"}`}
                      />
                    </div>
                    <div className="text-xs text-gray-400">{friend.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{friend.drinks} drinks</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Safety Check */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-400" />
              Safety Check
            </CardTitle>
            <CardDescription className="text-gray-300">Estimated levels - not medical advice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Estimated BAC</span>
                <span className="font-bold">{(estimatedBAC * 100).toFixed(2)}%</span>
              </div>
              <Progress
                value={estimatedBAC * 100 * 5}
                className={`${estimatedBAC > 0.08 ? "bg-red-500" : "bg-yellow-500"}`}
              />
              <p className="text-xs text-gray-400 mt-1">
                {estimatedBAC > 0.08 ? "Over legal limit" : "Under legal limit"}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Hydration Level</span>
                <span className="font-bold">{hydrationLevel}%</span>
              </div>
              <Progress value={hydrationLevel} />
              {hydrationLevel < 50 && <p className="text-xs text-yellow-400 mt-1">💧 Time for some water!</p>}
            </div>
          </CardContent>
        </Card>

        {/* Recent Drinks */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Drinks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {drinks
              .slice(-3)
              .reverse()
              .map((drink) => (
                <div key={drink.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <div>
                    <div className="font-medium">{drink.name}</div>
                    <div className="text-xs text-gray-400">
                      {drink.time} • {drink.venue}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">£{drink.price}</div>
                    <div className="text-xs text-gray-400">{drink.alcohol}%</div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Camera className="h-4 w-4 mr-2" />
            Share Photo
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <MapPin className="h-4 w-4 mr-2" />
            Share Location
          </Button>
        </div>

        {/* Emergency Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-red-600 hover:bg-red-700 h-16 flex-col">
            <Phone className="h-5 w-5 mb-1" />
            <span className="text-xs">Emergency</span>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 h-16 flex-col">
            <Car className="h-5 w-5 mb-1" />
            <span className="text-xs">Get Ride</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
