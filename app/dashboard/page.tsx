"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageCircle,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Calendar,
  BookOpen,
  Activity,
  LogOut,
  Settings,
} from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (status === "unauthenticated") {
      console.log("User not authenticated, redirecting to signin")
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      console.log("User authenticated:", session?.user)
      setIsLoading(false)
    }
  }, [status, router, session])

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null // Will redirect
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PeerConnect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={session?.user?.image || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {session?.user?.name ? getInitials(session.user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening in your network today.</p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">✅ Successfully signed in! Your account is working properly.</p>
            <p className="text-sm text-green-600 mt-1">Email: {session?.user?.email}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connections</p>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-green-600">156</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projects</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50/50">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-500 text-white">AC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Alex Chen</span> connected with you
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50/50">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-purple-500 text-white">SJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Sarah Johnson</span> sent you a message
                      </p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50/50">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-green-500 text-white">MG</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Maria Garcia</span> liked your post
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Connections */}
            <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Suggested Connections</span>
                </CardTitle>
                <CardDescription>Students you might want to connect with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-500">Computer Science • 3rd Year</p>
                        <div className="flex space-x-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            React
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Python
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-purple-500 text-white">EM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Emily Martinez</p>
                        <p className="text-sm text-gray-500">Data Science • 2nd Year</p>
                        <div className="flex space-x-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Machine Learning
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Statistics
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Find Students
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your profile to get better matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Basic info added</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Skills added</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Add profile photo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Write bio</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-3">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
