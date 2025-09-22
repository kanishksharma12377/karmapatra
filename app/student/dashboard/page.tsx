"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award, Upload, FileText, TrendingUp, BookOpen, Loader2, Trophy, Star, Target, LogOut } from "lucide-react"
import { calculatePoints, POINTS_CONFIG, type PointsBreakdown } from "@/lib/points-system"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface StudentData {
  name: string
  rollNumber: string
  department: string
  email: string
  uid: string
}

interface Activity {
  id: string
  title: string
  type: string
  status: 'pending' | 'approved' | 'rejected'
  studentName: string
  rollNumber: string
  submittedAt: string
}

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [pointsData, setPointsData] = useState<PointsBreakdown | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const router = useRouter()

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('studentData')
    toast.success('Logged out successfully!')
    router.push('/login?type=student')
  }

  useEffect(() => {
    // Check for student session in localStorage
    const studentSession = localStorage.getItem('studentData')
    
    if (!studentSession) {
      if (!redirecting) {
        setRedirecting(true)
        console.log("[v0] Student dashboard: no session found, redirecting to login")
        setTimeout(() => {
          router.push("/login?type=student")
        }, 100)
      }
      return
    }

    try {
      const student = JSON.parse(studentSession)
      setCurrentStudent(student)
      
      // For demo purposes, create basic student data
      const demoStudentData: StudentData = {
        name: student.name || student.email.split('@')[0],
        rollNumber: `STU${student.uid.slice(-6)}`,
        department: 'Computer Science',
        email: student.email,
        uid: student.uid
      }
      setStudentData(demoStudentData)
      
      // For demo, create some sample activities
      const sampleActivities: Activity[] = [
        {
          id: '1',
          title: 'Web Development Project',
          type: 'project',
          status: 'approved',
          studentName: demoStudentData.name,
          rollNumber: demoStudentData.rollNumber,
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2', 
          title: 'Data Structures Assignment',
          type: 'assignment',
          status: 'pending',
          studentName: demoStudentData.name,
          rollNumber: demoStudentData.rollNumber,
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Programming Quiz',
          type: 'quiz', 
          status: 'approved',
          studentName: demoStudentData.name,
          rollNumber: demoStudentData.rollNumber,
          submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          title: 'React Workshop',
          type: 'workshop',
          status: 'approved',
          studentName: demoStudentData.name,
          rollNumber: demoStudentData.rollNumber,
          submittedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]
      
      setActivities(sampleActivities)
      setLoading(false)
      
    } catch (error) {
      console.error('Error parsing student session:', error)
      router.push("/login?type=student")
    }
  }, [router, redirecting])

  // Calculate points whenever activities change
  useEffect(() => {
    if (activities.length >= 0) {
      const points = calculatePoints(activities)
      setPointsData(points)
    }
  }, [activities])

  if (loading || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please log in to access the student dashboard.</p>
          <Link href="/login?type=student">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const approvedActivities = activities.filter((a) => a.status === "approved").length
  const filtered = filter === "all" ? activities : activities.filter((a) => a.status === filter)
  const recentActivities = filtered.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Welcome back, {studentData?.name || "Student"}!
            </h1>
            <p className="text-muted-foreground">
              {studentData?.rollNumber || "N/A"} • {studentData?.department || "N/A"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Points & Achievement Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Total Points Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {pointsData?.totalPoints || 0}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  From {pointsData?.approvedActivities || 0} approved activities
                </p>
                <Link href="/student/points">
                  <Button variant="ghost" size="sm" className="text-xs p-1 h-auto">
                    Details →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Current Badge Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Badge</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: pointsData?.currentMilestone?.color || '#6b7280' }}>
                {pointsData?.currentMilestone?.badge || 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                {pointsData?.currentMilestone?.title || 'Keep submitting activities!'}
              </p>
            </CardContent>
          </Card>

          {/* Progress to Next Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress to Next</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {Math.round(pointsData?.progressToNext || 0)}%
              </div>
              <Progress value={pointsData?.progressToNext || 0} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Next: {pointsData?.nextMilestone?.badge || 'Max level reached'}
              </p>
            </CardContent>
          </Card>

          {/* Activities Summary Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activities.length}</div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span className="text-green-600">{pointsData?.approvedActivities || 0} approved</span>
                <span className="text-yellow-600">{pointsData?.pendingActivities || 0} pending</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points Breakdown Section */}
        {pointsData && pointsData.totalPoints > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Points by Activity Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Points by Activity Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(pointsData.pointsByType).map(([type, points]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm capitalize font-medium">
                        {type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{points} pts</span>
                        <Badge variant="outline" className="text-xs">
                          {POINTS_CONFIG.activities[type as keyof typeof POINTS_CONFIG.activities] || POINTS_CONFIG.activities.default} pts each
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Milestones
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>Track your progress and unlock badges</span>
                  <Link href="/student/points">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {POINTS_CONFIG.milestones.slice(0, 4).map((milestone, index) => {
                    const isAchieved = (pointsData.totalPoints >= milestone.points)
                    const isCurrent = pointsData.currentMilestone?.points === milestone.points
                    const isNext = pointsData.nextMilestone?.points === milestone.points && !isAchieved
                    
                    return (
                      <div key={index} className={`flex justify-between items-center p-2 rounded ${
                        isCurrent ? 'bg-primary/10 border border-primary/20' : 
                        isNext ? 'bg-yellow-50 border border-yellow-200' : ''
                      }`}>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`w-3 h-3 rounded-full ${isAchieved ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                          <span className={`text-sm font-medium ${isAchieved ? 'text-green-700' : 'text-gray-600'}`}>
                            {milestone.badge}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold" style={{ color: milestone.color }}>
                            {milestone.points} pts
                          </span>
                          {isCurrent && <Badge className="ml-2 text-xs">Current</Badge>}
                          {isNext && <Badge variant="outline" className="ml-2 text-xs">Next Goal</Badge>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Original Stats Cards - Simplified */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">92%</div>
              <p className="text-xs text-muted-foreground">Great attendance record!</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{approvedActivities}</div>
              <p className="text-xs text-muted-foreground">
                Activities approved
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">A+</div>
              <p className="text-xs text-muted-foreground">
                Overall grade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Submit New Activity
              </CardTitle>
              <CardDescription>
                Upload your latest projects, assignments, or achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/upload">
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Activity
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                View Portfolio
              </CardTitle>
              <CardDescription>
                See all your submitted work and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/portfolio">
                <Button variant="outline" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Portfolio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Your latest submissions and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Activities List */}
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {activity.type.replace('_', ' ')} • {new Date(activity.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        activity.status === "approved" ? "default" :
                        activity.status === "pending" ? "secondary" :
                        "destructive"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No activities found for this filter.</p>
                  <Link href="/student/upload">
                    <Button className="mt-4">Submit Your First Activity</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}