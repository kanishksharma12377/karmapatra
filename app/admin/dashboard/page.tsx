"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navigation } from "@/components/navigation"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Shield, Users, FileText, TrendingUp, Check, X, Clock, Eye } from "lucide-react"

export default function AdminDashboard() {
  // Mock data for submissions
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: "Priya Sharma",
      rollNumber: "CS21B1001",
      activity: "Google Summer of Code 2024",
      type: "Internship",
      submittedDate: "2024-01-15",
      status: "Pending",
    },
    {
      id: 2,
      studentName: "Rahul Kumar",
      rollNumber: "CS21B1002",
      activity: "Web Development Workshop",
      type: "Workshop",
      submittedDate: "2024-01-14",
      status: "Approved",
    },
    {
      id: 3,
      studentName: "Anita Singh",
      rollNumber: "CS21B1003",
      activity: "Hackathon Winner",
      type: "Competition",
      submittedDate: "2024-01-13",
      status: "Pending",
    },
    {
      id: 4,
      studentName: "Vikram Patel",
      rollNumber: "CS21B1004",
      activity: "AWS Certification",
      type: "Certification",
      submittedDate: "2024-01-12",
      status: "Approved",
    },
    {
      id: 5,
      studentName: "Sneha Gupta",
      rollNumber: "CS21B1005",
      activity: "Volunteer Teaching",
      type: "Volunteering",
      submittedDate: "2024-01-11",
      status: "Rejected",
    },
  ])

  // Analytics data
  const pieData = [
    { name: "Approved", value: 45, color: "#22c55e" },
    { name: "Pending", value: 35, color: "#f59e0b" },
    { name: "Rejected", value: 20, color: "#ef4444" },
  ]

  const barData = [
    { month: "Jan", submissions: 65, approved: 45 },
    { month: "Feb", submissions: 78, approved: 52 },
    { month: "Mar", submissions: 90, approved: 68 },
    { month: "Apr", submissions: 85, approved: 61 },
    { month: "May", submissions: 95, approved: 72 },
    { month: "Jun", submissions: 88, approved: 65 },
  ]

  const handleStatusChange = (id: number, newStatus: string) => {
    setSubmissions((prev) =>
      prev.map((submission) => (submission.id === id ? { ...submission, status: newStatus } : submission)),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">KarmaPatra — Admin Panel</h1>
          <p className="text-muted-foreground">Manage student submissions and track platform analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">3,456</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-foreground">23</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">78%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Submission Status Distribution</CardTitle>
              <CardDescription>Current status of all submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Submission Trends</CardTitle>
              <CardDescription>Submissions vs approvals over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="submissions" fill="hsl(var(--primary))" name="Submissions" />
                  <Bar dataKey="approved" fill="hsl(var(--accent))" name="Approved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Student Submissions
            </CardTitle>
            <CardDescription>Review and manage student activity submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.studentName}</div>
                        <div className="text-sm text-muted-foreground">{submission.rollNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">{submission.activity}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{submission.type}</Badge>
                    </TableCell>
                    <TableCell>{new Date(submission.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(submission.id, "Approved")}
                          disabled={submission.status === "Approved"}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(submission.id, "Rejected")}
                          disabled={submission.status === "Rejected"}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
