"use client"
import { Star } from "lucide-react"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Users, GraduationCap, MessageCircle, Globe, Sparkles, ArrowRight, Shield, Zap } from "lucide-react"

// Enhanced emoji categories
const emojiCategories = {
  "Smileys & People": [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "🤣",
    "😂",
    "🙂",
    "🙃",
    "😉",
    "😊",
    "😇",
    "🥰",
    "😍",
    "🤩",
    "😘",
    "😗",
    "😚",
    "😙",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
    "🤐",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😏",
    "😒",
    "🙄",
    "😬",
    "🤥",
    "😔",
    "😪",
    "🤤",
    "😴",
    "😷",
    "🤒",
    "🤕",
    "🤢",
    "🤮",
    "🤧",
    "🥵",
    "🥶",
    "🥴",
    "😵",
    "🤯",
    "🤠",
    "🥳",
    "😎",
    "🤓",
    "🧐",
  ],
  Activities: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛷",
    "⛸",
    "🥌",
    "🎿",
    "⛷",
    "🏂",
    "🪂",
    "🏋",
    "🤸",
    "🤺",
    "🤾",
    "🏌",
    "🏇",
    "🧘",
    "🏄",
    "🏊",
    "🤽",
    "🚣",
    "🧗",
    "🚵",
    "🚴",
    "🏆",
    "🥇",
    "🥈",
    "🥉",
    "🏅",
    "🎖",
    "🏵",
    "🎗",
    "🎫",
    "🎟",
    "🎪",
    "🤹",
    "🎭",
    "🩰",
    "🎨",
    "🎬",
    "🎤",
    "🎧",
    "🎼",
    "🎵",
    "🎶",
    "🎯",
    "🎲",
    "🎰",
    "🎳",
  ],
  Objects: [
    "⌚",
    "📱",
    "📲",
    "💻",
    "⌨",
    "🖥",
    "🖨",
    "🖱",
    "🖲",
    "🕹",
    "🗜",
    "💽",
    "💾",
    "💿",
    "📀",
    "📼",
    "📷",
    "📸",
    "📹",
    "🎥",
    "📽",
    "🎞",
    "📞",
    "☎",
    "📟",
    "📠",
    "📺",
    "📻",
    "🎙",
    "🎚",
    "🎛",
    "🧭",
    "⏱",
    "⏲",
    "⏰",
    "🕰",
    "⌛",
    "⏳",
    "📡",
    "🔋",
    "🔌",
    "💡",
    "🔦",
    "🕯",
    "🪔",
    "🧯",
    "🛢",
    "💸",
    "💵",
    "💴",
    "💶",
    "💷",
    "🪙",
    "💰",
    "💳",
    "💎",
    "⚖",
    "🪜",
    "🧰",
    "🔧",
    "🔨",
    "⚒",
    "🛠",
    "⛏",
    "🪓",
    "🪚",
    "🔩",
    "⚙",
    "🪤",
    "🧱",
    "⛓",
    "🧲",
  ],
  Symbols: [
    "❤",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮",
    "✝",
    "☪",
    "🕉",
    "☸",
    "✡",
    "🔯",
    "🕎",
    "☯",
    "☦",
    "🛐",
    "⛎",
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
    "🆔",
    "⚛",
    "🉑",
    "☢",
    "☣",
    "📴",
    "📳",
    "🈶",
    "🈚",
    "🈸",
    "🈺",
    "🈷",
    "✴",
    "🆚",
    "💮",
    "🉐",
    "㊙",
    "㊗",
    "🈴",
    "🈵",
    "🈹",
    "🈲",
    "🅰",
    "🅱",
    "🆎",
    "🆑",
    "🅾",
    "🆘",
    "❌",
    "⭕",
    "🛑",
    "⛔",
    "📛",
    "🚫",
    "💯",
    "💢",
    "♨",
    "🚷",
    "🚯",
    "🚳",
    "🚱",
    "🔞",
    "📵",
    "🚭",
    "❗",
    "❕",
    "❓",
    "❔",
    "‼",
    "⁉",
    "🔅",
    "🔆",
    "〽",
    "⚠",
    "🚸",
    "🔱",
    "⚜",
    "🔰",
    "♻",
    "✅",
    "🈯",
    "💹",
    "❇",
    "✳",
    "❎",
    "🌐",
    "💠",
    "Ⓜ",
    "🌀",
    "💤",
    "🏧",
    "🚾",
    "♿",
    "🅿",
    "🈳",
    "🈂",
    "🛂",
    "🛃",
    "🛄",
    "🛅",
    "🚹",
    "🚺",
    "🚼",
    "⚧",
    "🚻",
    "🚮",
    "🎦",
    "📶",
    "🈁",
    "🔣",
    "ℹ",
    "🔤",
    "🔡",
    "🔠",
    "🆖",
    "🆗",
    "🆙",
    "🆒",
    "🆕",
    "🆓",
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
  ],
}

const recentEmojis = ["😀", "😍", "🎉", "👍", "❤", "😂", "🔥", "💯"]

// Types
interface Student {
  id: string
  name: string
  studentId: string
  year: string
  department: string
  skills: string[]
  interests: string[]
  projectAreas: string[]
  bio?: string
  email?: string
  avatar?: string
  lastSeen?: number
  isOnline?: boolean
  connections?: number
  posts?: number
  views?: number
  location?: string
  joinedDate?: string
  achievements?: string[]
  mutualConnections?: string[]
  isVerified?: boolean
  coverImage?: string
}

interface Connection {
  studentId: string
  status: "pending" | "sent" | "accepted" | "rejected"
  timestamp: number
  requesterId?: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: number
  read: boolean
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  lastActivity: number
  unreadCount: number
}

interface Post {
  id: string
  authorId: string
  content: string
  image?: string
  timestamp: number
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  tags: string[]
}

interface Notification {
  id: string
  type: "connection" | "like" | "comment" | "message" | "achievement" | "connection_request"
  fromUserId: string
  message: string
  timestamp: number
  read: boolean
  actionUrl?: string
  connectionId?: string
}

interface VoiceCall {
  id: string
  callerId: string
  receiverId: string
  status: "ringing" | "active" | "ended" | "declined"
  startTime: number
  endTime?: number
  duration?: number
}

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alex Chen",
    studentId: "CS2021001",
    year: "3rd Year",
    department: "Computer Science",
    skills: ["React", "Python", "Machine Learning", "TypeScript", "Node.js"],
    interests: ["AI", "Web Development", "Data Science", "Blockchain", "Gaming"],
    projectAreas: ["AI Research", "Web Apps", "Mobile Development"],
    bio: "Passionate about AI and building innovative web applications. Currently working on a machine learning project for predictive analytics. Always excited to collaborate on cutting-edge tech projects! 🚀",
    email: "alex.chen@university.edu",
    isOnline: true,
    lastSeen: Date.now(),
    connections: 234,
    posts: 45,
    views: 1250,
    location: "San Francisco, CA",
    joinedDate: "September 2021",
    achievements: ["Dean's List", "Hackathon Winner", "Research Assistant"],
    mutualConnections: ["2", "3", "4"],
    isVerified: true,
    avatar: "/placeholder.svg?height=100&width=100&text=AC",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    studentId: "DS2022015",
    year: "2nd Year",
    department: "Data Science",
    skills: ["Python", "R", "SQL", "Tableau", "TensorFlow", "Statistics"],
    interests: ["Data Visualization", "Statistics", "Research", "Psychology", "Healthcare"],
    projectAreas: ["Data Analytics", "Research Projects", "Healthcare AI"],
    bio: "Data enthusiast with a love for uncovering insights from complex datasets. Specializing in healthcare analytics and predictive modeling. Let's turn data into actionable insights! 📊",
    email: "sarah.j@university.edu",
    isOnline: false,
    lastSeen: Date.now() - 1800000,
    connections: 189,
    posts: 32,
    views: 890,
    location: "Boston, MA",
    joinedDate: "January 2022",
    achievements: ["Research Excellence", "Data Science Competition Winner"],
    mutualConnections: ["1", "3", "5"],
    isVerified: false,
    avatar: "/placeholder.svg?height=100&width=100&text=SJ",
  },
  // Add more mock students as needed...
]

const mockPosts: Post[] = [
  {
    id: "1",
    authorId: "1",
    content:
      "Just finished building an AI-powered study buddy app! 🤖 It uses natural language processing to help students understand complex concepts. The beta testing results are amazing - 85% improvement in comprehension rates! Who wants to try it out? #AI #EdTech #Innovation",
    image: "/placeholder.svg?height=400&width=600&query=AI+app+interface",
    timestamp: Date.now() - 3600000,
    likes: 47,
    comments: 12,
    shares: 8,
    isLiked: false,
    isBookmarked: true,
    tags: ["AI", "EdTech", "Innovation"],
  },
  {
    id: "2",
    authorId: "2",
    content:
      "Excited to share my latest UI/UX project - a redesign of our campus library system! 📚✨ Focused on improving accessibility and user experience. The new interface reduced task completion time by 40%. Design thinking really works! #UXDesign #Accessibility #CampusLife",
    image: "/placeholder.svg?height=400&width=600&query=library+app+design",
    timestamp: Date.now() - 7200000,
    likes: 63,
    comments: 18,
    shares: 15,
    isLiked: true,
    isBookmarked: false,
    tags: ["UXDesign", "Accessibility", "CampusLife"],
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "connection_request",
    fromUserId: "2",
    message: "Sarah Johnson wants to connect with you",
    timestamp: Date.now() - 1800000,
    read: false,
    connectionId: "2",
  },
  {
    id: "2",
    type: "like",
    fromUserId: "1",
    message: "Alex Chen liked your post about AI study buddy",
    timestamp: Date.now() - 3600000,
    read: false,
  },
]

const departments = [
  "Computer Science",
  "Data Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Biotechnology",
  "Graphic Design",
  "Business Administration",
  "Mathematics",
  "Physics",
  "Chemistry",
]

const skillOptions = [
  "React",
  "Python",
  "JavaScript",
  "Java",
  "C++",
  "Machine Learning",
  "Data Analysis",
  "UI/UX Design",
  "Figma",
  "Adobe Creative Suite",
  "CAD",
  "3D Printing",
  "Arduino",
  "MATLAB",
  "R",
  "SQL",
  "Tableau",
  "Research",
  "Lab Techniques",
  "Circuit Design",
]

const interestOptions = [
  "AI",
  "Web Development",
  "Data Science",
  "Machine Learning",
  "IoT",
  "Robotics",
  "Design",
  "User Experience",
  "Branding",
  "Product Design",
  "Sustainability",
  "Medical Research",
  "Genetics",
  "Bioinformatics",
  "Innovation",
  "Research",
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600">
            <div className="w-full h-full border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading PeerConnect...</p>
        </div>
      </div>
    )
  }

  if (status === "authenticated") {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PeerConnect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/auth/signin")} className="hover:bg-white/20">
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/auth/signup")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Connect. Collaborate. Create.
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Build Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Academic Network
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Connect with fellow students, collaborate on projects, and build meaningful relationships that will last
                throughout your academic journey and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push("/auth/signup")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                >
                  Join PeerConnect
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/auth/signin")}
                  className="px-8 py-4 text-lg border-2 hover:bg-white/50"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Connect</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to help students build meaningful connections and collaborate effectively.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Smart Matching</CardTitle>
                  <CardDescription>
                    Find students with similar interests, skills, and academic goals through our intelligent matching
                    system.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 2 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Real-time Messaging</CardTitle>
                  <CardDescription>
                    Communicate instantly with your peers through our built-in messaging system with emoji support.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Advanced Search</CardTitle>
                  <CardDescription>
                    Discover students by department, skills, interests, or project areas with powerful filtering
                    options.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 4 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Social Feed</CardTitle>
                  <CardDescription>
                    Share updates, achievements, and projects with your network through an engaging social feed.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 5 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Privacy First</CardTitle>
                  <CardDescription>
                    Your data is secure with end-to-end encryption and granular privacy controls.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 6 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Built with modern technology for instant loading and seamless user experience.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Thousands of Students</h2>
              <p className="text-xl text-gray-600">
                Students worldwide are already building their networks on PeerConnect
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">50K+</div>
                <div className="text-gray-600">Connections Made</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">Universities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "PeerConnect helped me find study partners for my computer science courses. I've made lasting
                    friendships and improved my grades!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      A
                    </div>
                    <div>
                      <div className="font-semibold">Alex Chen</div>
                      <div className="text-sm text-gray-500">Computer Science, 3rd Year</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The platform is intuitive and helped me connect with students from different departments. Great for
                    interdisciplinary projects!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      S
                    </div>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-gray-500">Data Science, 2nd Year</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Amazing platform! I found my research partner here and we're now working on a published paper
                    together."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      M
                    </div>
                    <div>
                      <div className="font-semibold">Maria Garcia</div>
                      <div className="text-sm text-gray-500">Biology, Graduate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Build Your Network?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students who are already connecting, collaborating, and creating together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/auth/signup")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/auth/signin")}
                className="px-8 py-4 text-lg border-2 hover:bg-white/50"
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">PeerConnect</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting students worldwide to build meaningful academic and professional relationships.
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  Made with ❤️ for students
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PeerConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
