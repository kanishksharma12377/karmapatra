"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Trophy, User, Bell, Settings, LogOut, Play, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const studentData = {
    name: "Alex Johnson",
    email: "alex.johnson@student.edu",
    studentId: "STU2024001",
    enrolledCourses: 4,
    completedCourses: 2,
    totalPoints: 1250,
    currentLevel: "Intermediate",
  }

  const courses = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      progress: 85,
      status: "In Progress",
      nextLesson: "Data Structures",
      instructor: "Dr. Smith",
      dueDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      progress: 60,
      status: "In Progress",
      nextLesson: "React Components",
      instructor: "Prof. Johnson",
      dueDate: "2024-01-20",
    },
    {
      id: 3,
      title: "Database Management",
      progress: 100,
      status: "Completed",
      nextLesson: "Course Complete",
      instructor: "Dr. Wilson",
      dueDate: "Completed",
    },
  ]

  const recentActivities = [
    {
      type: "assignment",
      title: "Completed Assignment: React Hooks",
      time: "2 hours ago",
      points: 50,
    },
    {
      type: "quiz",
      title: "Passed Quiz: JavaScript Fundamentals",
      time: "1 day ago",
      points: 30,
    },
    {
      type: "achievement",
      title: "Earned Badge: Quick Learner",
      time: "2 days ago",
      points: 100,
    },
  ]

  const upcomingDeadlines = [
    {
      title: "React Project Submission",
      course: "Web Development",
      dueDate: "2024-01-15",
      priority: "high",
    },
    {
      title: "Database Design Quiz",
      course: "Database Management",
      dueDate: "2024-01-18",
      priority: "medium",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {studentData.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{studentData.enrolledCourses}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{studentData.completedCourses}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Points</p>
                      <p className="text-2xl font-bold text-gray-900">{studentData.totalPoints}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Current Level</p>
                      <p className="text-2xl font-bold text-gray-900">{studentData.currentLevel}</p>
                    </div>
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                        <Badge variant="secondary">+{activity.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Don't miss these important dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{deadline.title}</p>
                          <p className="text-sm text-gray-500">{deadline.course}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={deadline.priority === "high" ? "destructive" : "secondary"}>
                            {deadline.dueDate}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant={course.status === "Completed" ? "default" : "secondary"}>{course.status}</Badge>
                    </div>
                    <CardDescription>Instructor: {course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Next: {course.nextLesson}</span>
                        <span className="text-gray-600">Due: {course.dueDate}</span>
                      </div>

                      <Button className="w-full" variant={course.status === "Completed" ? "outline" : "default"}>
                        {course.status === "Completed" ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review Course
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue Learning
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Track your academic journey and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                      <p className="text-gray-600">Overall Progress</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                      <p className="text-gray-600">Assignments Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
                      <p className="text-gray-600">Badges Earned</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Course Progress</h3>
                    {courses.map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{course.title}</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{studentData.name}</h3>
                      <p className="text-gray-600">{studentData.email}</p>
                      <p className="text-sm text-gray-500">Student ID: {studentData.studentId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={studentData.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={studentData.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                  </div>

                  <Button>Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
