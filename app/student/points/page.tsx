"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Target, Award, TrendingUp, Info } from "lucide-react"
import { useAuthState } from "@/hooks/use-auth"
import { listenToStudentActivities, type Activity } from "@/lib/firebase-data"
import { calculatePoints, POINTS_CONFIG, getPointsForActivityType, type PointsBreakdown } from "@/lib/points-system"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function StudentPointsPage() {
  const { user, profile, loading: authLoading } = useAuthState()
  const [activities, setActivities] = useState<Activity[]>([])
  const [pointsData, setPointsData] = useState<PointsBreakdown | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return

    if (!user || (profile && profile.role !== "student")) {
      router.push("/login?type=student")
      return
    }

    if (user) {
      const unsub = listenToStudentActivities(user.uid, (list) => {
        setActivities(list)
        setLoading(false)
      })
      return () => unsub()
    }
  }, [user, profile, authLoading, router])

  // Calculate points whenever activities change
  useEffect(() => {
    if (activities.length >= 0) {
      const points = calculatePoints(activities)
      setPointsData(points)
    }
  }, [activities])

  if (authLoading || loading) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              My Points & Achievements
            </h1>
            <p className="text-muted-foreground">
              Track your progress and earn rewards for your activities
            </p>
          </div>
          <Link href="/student/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Points Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6 text-yellow-500" />
                {pointsData?.totalPoints || 0} Total Points
              </CardTitle>
              <CardDescription>
                {pointsData?.currentMilestone ? (
                  <span className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: pointsData.currentMilestone.color, color: 'white' }}>
                      {pointsData.currentMilestone.badge}
                    </Badge>
                    {pointsData.currentMilestone.title}
                  </span>
                ) : (
                  "Start submitting activities to earn points!"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pointsData?.nextMilestone && pointsData.currentMilestone !== pointsData.nextMilestone ? (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progress to {pointsData.nextMilestone.badge}</span>
                    <span className="text-sm text-muted-foreground">
                      {pointsData.totalPoints} / {pointsData.nextMilestone.points} points
                    </span>
                  </div>
                  <Progress value={pointsData.progressToNext} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {pointsData.nextMilestone.points - pointsData.totalPoints} points to go!
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Star className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Congratulations!</p>
                  <p className="text-muted-foreground">You've reached the highest level!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Submitted</span>
                  <span className="font-bold">{activities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">Approved</span>
                  <span className="font-bold text-green-600">{pointsData?.approvedActivities || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-yellow-600">Pending</span>
                  <span className="font-bold text-yellow-600">{pointsData?.pendingActivities || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-red-600">Rejected</span>
                  <span className="font-bold text-red-600">{pointsData?.rejectedActivities || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Milestones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Achievement Milestones
            </CardTitle>
            <CardDescription>
              Complete activities to unlock badges and reach new levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {POINTS_CONFIG.milestones.map((milestone, index) => {
                const isAchieved = (pointsData?.totalPoints || 0) >= milestone.points
                const isCurrent = pointsData?.currentMilestone?.points === milestone.points
                const isNext = pointsData?.nextMilestone?.points === milestone.points && !isAchieved
                
                return (
                  <Card key={index} className={`relative ${
                    isCurrent ? 'border-2 border-primary shadow-lg' : 
                    isNext ? 'border-2 border-yellow-400' :
                    isAchieved ? 'border-2 border-green-400' : 'opacity-75'
                  }`}>
                    <CardContent className="p-4 text-center">
                      <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                        isAchieved ? 'bg-green-100' : isNext ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <Trophy 
                          className={`h-8 w-8 ${
                            isAchieved ? 'text-green-600' : isNext ? 'text-yellow-600' : 'text-gray-400'
                          }`} 
                        />
                      </div>
                      <h3 className="font-bold" style={{ color: milestone.color }}>
                        {milestone.badge}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {milestone.title}
                      </p>
                      <Badge variant={isAchieved ? "default" : "outline"}>
                        {milestone.points} points
                      </Badge>
                      {isCurrent && (
                        <Badge className="absolute -top-2 -right-2 bg-primary">
                          Current
                        </Badge>
                      )}
                      {isNext && (
                        <Badge className="absolute -top-2 -right-2 bg-yellow-500">
                          Next Goal
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Points Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Points by Activity Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Points by Activity Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pointsData && Object.keys(pointsData.pointsByType).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(pointsData.pointsByType)
                    .sort(([,a], [,b]) => b - a)
                    .map(([type, points]) => {
                      const maxPoints = Math.max(...Object.values(pointsData.pointsByType))
                      const percentage = (points / maxPoints) * 100
                      
                      return (
                        <div key={type}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium capitalize">
                              {type.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-bold">{points} pts</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No approved activities yet. Start submitting to see your progress!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Points Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Points Reference
              </CardTitle>
              <CardDescription>
                Points awarded for different activity types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(POINTS_CONFIG.activities)
                  .filter(([key]) => key !== 'default')
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, points]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm capitalize">
                        {type.replace('_', ' ')}
                      </span>
                      <Badge variant="outline">{points} pts</Badge>
                    </div>
                  ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Points are awarded only when activities are approved by teachers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="py-8">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Keep Going!</h2>
            <p className="text-muted-foreground mb-4">
              Submit more activities to earn points and unlock achievements
            </p>
            <Link href="/student/upload">
              <Button size="lg" className="mr-4">
                Submit New Activity
              </Button>
            </Link>
            <Link href="/student/portfolio">
              <Button variant="outline" size="lg">
                View Portfolio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}