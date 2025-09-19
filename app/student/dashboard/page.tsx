"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award, Upload, FileText, TrendingUp, BookOpen, Loader2 } from "lucide-react"
import { useAuthState } from "@/hooks/use-auth"
import { getStudentActivities, getStudentProfile } from "@/lib/firebase-data"
import type { Activity, StudentData } from "@/lib/firebase-data"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const { user, profile, loading: authLoading } = useAuthState()
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return

    if (!user || (profile && profile.role !== "student")) {
      if (!redirecting) {
        setRedirecting(true)
        console.log("[v0] Student dashboard: redirecting to login, user:", !!user, "profile role:", profile?.role)
        setTimeout(() => {
          router.push("/login?type=student")
        }, 100) // Small delay to prevent rapid redirects
      }
      return
    }

    if (user && (!profile || profile.role === "student")) {
      const fetchData = async () => {
        try {
          const [profileData, activitiesData] = await Promise.all([
            getStudentProfile(user.uid),
            getStudentActivities(user.uid),
          ])

          setStudentData(profileData)
          setActivities(activitiesData)
        } catch (error) {
          console.error("Error fetching student data:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [user, profile, authLoading, router, redirecting])

  if (authLoading || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || (profile && profile.role !== "student")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const approvedActivities = activities.filter((a) => a.status === "approved").length
  const recentActivities = activities.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {studentData?.name || profile?.name || "Student"}!
          </h1>
          <p className="text-muted-foreground">
            {studentData?.rollNumber || "N/A"} • {studentData?.department || "N/A"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{studentData?.attendance || 0}%</div>
              <Progress value={studentData?.attendance || 0} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {(studentData?.attendance || 0) >= 75 ? "Good attendance record" : "Improve attendance"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Academic Grades</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{studentData?.cgpa || "N/A"}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">Keep it up!</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">CGPA out of 10.0</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities Count</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{approvedActivities}</div>
              <p className="text-xs text-muted-foreground mt-2">Total approved activities</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button asChild size="lg" className="flex-1">
            <Link href="/student/upload">
              <Upload className="mr-2 h-5 w-5" />
              Upload Activity
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
            <Link href="/student/portfolio">
              <FileText className="mr-2 h-5 w-5" />
              View Portfolio
            </Link>
          </Button>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest submitted activities and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.type} • {activity.date.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={activity.status === "approved" ? "default" : "secondary"}
                      className={activity.status === "approved" ? "bg-green-100 text-green-800" : ""}
                    >
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No activities submitted yet. Start by uploading your first activity!
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
