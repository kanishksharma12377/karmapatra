"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Users, FileText, Check, X, Clock, Download, Filter, TrendingUp, LogOut } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import {
  listenToAllActivities,
  listenToUsersByRole,
  listenToRegisteredStudents,
  computeActivityMetrics,
  updateActivityStatus,
  type Activity,
  type RegisteredStudent,
} from "@/lib/firebase-data"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminDashboard() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [students, setStudents] = useState<{ id: string; name: string }[]>([])
  const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudent[]>([])
  const [activeTab, setActiveTab] = useState("review")

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminData')
    toast.success('Logged out successfully!')
    router.push('/login?type=admin')
  }

  // Filters (applied on All Submissions tab)
  const [statusFilter, setStatusFilter] = useState<"all" | Activity["status"]>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<string>("") // ISO yyyy-mm-dd
  const [dateTo, setDateTo] = useState<string>("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const unsubActivities = listenToAllActivities((list) => setActivities(list))
    const unsubStudents = listenToUsersByRole("student", (list) => setStudents(list))
    const unsubRegistrations = listenToRegisteredStudents((list) => setRegisteredStudents(list))
    return () => {
      unsubActivities()
      unsubStudents()
      unsubRegistrations()
    }
  }, [])

  const metrics = useMemo(() => computeActivityMetrics(activities), [activities])

  // Real-time chart data computed from activities
  const statusData = useMemo(() => {
    const total = activities.length
    if (total === 0) return []
    
    const approved = activities.filter(a => a.status === 'approved').length
    const pending = activities.filter(a => a.status === 'pending').length
    const rejected = activities.filter(a => a.status === 'rejected').length
    
    return [
      { name: 'Approved', value: Math.round((approved / total) * 100), color: '#8b5cf6' },
      { name: 'Pending', value: Math.round((pending / total) * 100), color: '#a78bfa' },
      { name: 'Rejected', value: Math.round((rejected / total) * 100), color: '#c4b5fd' }
    ]
  }, [activities])

  const monthlyData = useMemo(() => {
    // Group activities by month
    const monthGroups: Record<string, { submissions: number; approvals: number }> = {}
    
    activities.forEach(activity => {
      const date = new Date(activity.submittedAt)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' })
      
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = { submissions: 0, approvals: 0 }
      }
      
      monthGroups[monthKey].submissions++
      if (activity.status === 'approved') {
        monthGroups[monthKey].approvals++
      }
    })
    
    // Convert to array and get last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    const last6Months = []
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const monthName = months[monthIndex]
      last6Months.push({
        month: monthName,
        submissions: monthGroups[monthName]?.submissions || 0,
        approvals: monthGroups[monthName]?.approvals || 0
      })
    }
    
    return last6Months
  }, [activities])

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected") => {
    // Check for demo admin login
    const adminData = localStorage.getItem('adminData')
    if (!adminData) {
      toast.error("Not authenticated")
      return
    }
    try {
      // Use admin name from localStorage for demo
      const admin = JSON.parse(adminData)
      await updateActivityStatus(id, newStatus, admin.name || "Admin")
      toast.success(`Marked as ${newStatus}`)
    } catch (e) {
      console.error(e)
      toast.error("Failed to update status")
    }
  }

  const getStatusBadge = (status: Activity["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const reviewQueue = useMemo(() => activities.filter((a) => a.status === "pending"), [activities])

  const distinctTypes = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => a.type && set.add(a.type))
    return Array.from(set)
  }, [activities])

  const filteredAll = useMemo(() => {
    let list = activities
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter)
    if (typeFilter !== "all") list = list.filter((a) => a.type === typeFilter)
    if (dateFrom) {
      const from = new Date(dateFrom)
      list = list.filter((a) => new Date(a.submittedAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      // include entire day
      to.setHours(23, 59, 59, 999)
      list = list.filter((a) => new Date(a.submittedAt) <= to)
    }
    return list
  }, [activities, statusFilter, typeFilter, dateFrom, dateTo])

  const allSelected = useMemo(() => selectedIds.size > 0 && filteredAll.every((a) => a.id && selectedIds.has(a.id)), [filteredAll, selectedIds])

  const toggleSelectAll = () => {
    const next = new Set<string>()
    if (!allSelected) {
      filteredAll.forEach((a) => a.id && next.add(a.id))
    }
    setSelectedIds(next)
  }

  const toggleSelect = (id?: string) => {
    if (!id) return
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const bulkUpdate = async (newStatus: "approved" | "rejected") => {
    // Check for demo admin login
    const adminData = localStorage.getItem('adminData')
    if (!adminData) {
      toast.error("Not authenticated")
      return
    }
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    let ok = 0
    const admin = JSON.parse(adminData)
    for (const id of ids) {
      try {
        await updateActivityStatus(id, newStatus, admin.name || "Admin")
        ok++
      } catch (e) {
        console.error("bulk update failed for", id, e)
      }
    }
    toast.success(`Updated ${ok}/${ids.length} to ${newStatus}`)
    setSelectedIds(new Set())
  }

  const exportCSV = (list: Activity[], filename = "submissions.csv") => {
    const headers = [
      "ID",
      "Student Name",
      "Roll Number",
      "Title",
      "Type",
      "Status",
      "Submitted At",
      "Reviewed By",
      "Reviewed At",
    ]
    const rows = list.map((a) => [
      a.id ?? "",
      a.studentName,
      a.rollNumber,
      '"' + (a.title?.replaceAll('"', '""') ?? "") + '"',
      a.type ?? "",
      a.status,
      new Date(a.submittedAt).toISOString(),
      a.reviewedBy ?? "",
      a.reviewedAt ? new Date(a.reviewedAt).toISOString() : "",
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Smart Student Hub — Admin</h1>
            <p className="text-muted-foreground">Centralized review, insights, and reporting for student activities</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCSV(filteredAll)}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Live KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{students.length}</div>
              <p className="text-xs text-muted-foreground">Users with role "student"</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{metrics.total}</div>
              <p className="text-xs text-muted-foreground">All activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-foreground">{metrics.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{metrics.approved}</div>
              <p className="text-xs text-muted-foreground">Total approved activities</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Submission Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Submission Status Distribution</CardTitle>
              <CardDescription>Current status of all submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  approved: { label: "Approved", color: "#8b5cf6" },
                  pending: { label: "Pending", color: "#a78bfa" },
                  rejected: { label: "Rejected", color: "#c4b5fd" }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Submission Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Submission Trends</CardTitle>
              <CardDescription>Submissions vs approvals over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  submissions: { label: "Submissions", color: "#3b82f6" },
                  approvals: { label: "Approvals", color: "#10b981" }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="submissions" fill="#3b82f6" name="Submissions" />
                    <Bar dataKey="approvals" fill="#10b981" name="Approvals" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Review Queue, All Submissions, Insights */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="review">Review Queue</TabsTrigger>
            <TabsTrigger value="all">All Submissions</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Review Queue */}
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Review Queue (Pending)
                </CardTitle>
                <CardDescription>Approve or reject submissions in real-time</CardDescription>
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
                    {reviewQueue.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No pending submissions
                        </TableCell>
                      </TableRow>
                    ) : (
                      reviewQueue.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{submission.studentName}</div>
                              <div className="text-sm text-muted-foreground">{submission.rollNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[280px] truncate">{submission.title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{submission.type}</Badge>
                          </TableCell>
                          <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(submission.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(submission.id!, "approved")}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(submission.id!, "rejected")}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                              {submission.fileUrl ? (
                                <a href={submission.fileUrl} target="_blank" className="text-xs underline">
                                  Attachment
                                </a>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Submissions */}
          <TabsContent value="all">
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" /> All Submissions
                </CardTitle>
                <CardDescription>Search, filter, export, and take bulk actions</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                  <div className="md:col-span-2">
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {distinctTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </div>
                  <div>
                    <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => exportCSV(filteredAll)}>
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                  <Button variant="default" size="sm" onClick={() => bulkUpdate("approved")} disabled={selectedIds.size === 0}>
                    <Check className="h-4 w-4 mr-2" /> Approve Selected
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => bulkUpdate("rejected")} disabled={selectedIds.size === 0}>
                    <X className="h-4 w-4 mr-2" /> Reject Selected
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="Select all" />
                      </TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAll.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAll.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <Checkbox
                              checked={submission.id ? selectedIds.has(submission.id) : false}
                              onCheckedChange={() => toggleSelect(submission.id)}
                              aria-label="Select row"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{submission.studentName}</div>
                              <div className="text-sm text-muted-foreground">{submission.rollNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[280px] truncate">{submission.title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{submission.type}</Badge>
                          </TableCell>
                          <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(submission.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(submission.id!, "approved")}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(submission.id!, "rejected")}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                              {submission.fileUrl ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">View</Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                      <DialogTitle>{submission.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-2">
                                      <div className="text-sm text-muted-foreground">{submission.description}</div>
                                      <a className="underline text-sm" href={submission.fileUrl} target="_blank" rel="noreferrer">
                                        Open attachment
                                      </a>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registrations */}
          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>Student Registrations</CardTitle>
                <CardDescription>
                  View all students who have registered through the portal ({registeredStudents.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {registeredStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No registrations found</p>
                    <p className="text-sm">Students will appear here when they register</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registeredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell>{student.department}</TableCell>
                            <TableCell>{student.phoneNumber}</TableCell>
                            <TableCell>
                              {new Date(student.registrationDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                                {student.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights">
            <div className="grid lg:grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Statistics</CardTitle>
                  <CardDescription>Summary of all submissions and activity trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{metrics.approved}</div>
                      <div className="text-sm text-muted-foreground">Approved</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{metrics.pending}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{metrics.rejected}</div>
                      <div className="text-sm text-muted-foreground">Rejected</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{metrics.total}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
