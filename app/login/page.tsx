"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { User, Shield, Mail, Lock, AlertCircle, UserPlus } from "lucide-react"
import { signIn, signUp } from "@/lib/firebase-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showAdminRegistration, setShowAdminRegistration] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "admin" || type === "student") {
      setActiveTab(type)
    }
  }, [searchParams])

  const handleLogin = async (userType: string) => {
    if (!email || !password) return

    setLoading(true)
    setError("")
    setShowAdminRegistration(false)

    try {
      console.log("[v0] Starting login process for:", userType)
      const { user, profile } = await signIn(email, password)

      console.log("[v0] Login successful, user role:", profile?.role)

      // Check if user role matches selected tab
      if (profile?.role !== userType) {
        setError(`This account is not registered as a ${userType}`)
        setLoading(false)
        return
      }

      // Redirect based on user role
      if (profile?.role === "student") {
        console.log("[v0] Redirecting to student dashboard")
        router.push("/student/dashboard")
      } else if (profile?.role === "admin") {
        console.log("[v0] Redirecting to admin dashboard")
        router.push("/admin/dashboard")
      }
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      if (error.message.includes("Invalid email or password")) {
        // Check if this is a default test account that needs to be created
        if (userType === "admin" && email === "admin@college.edu" && password === "admin123") {
          setShowAdminRegistration(true)
          setError("Admin account doesn't exist. Click below to create it.")
        } else if (
          userType === "student" &&
          email.startsWith("student") &&
          email.endsWith("@college.edu") &&
          password === "student123"
        ) {
          // Auto-create student account
          try {
            console.log("[v0] Creating student account:", email)
            const studentNumber = email.split("@")[0].replace("student", "")
            const studentProfile = {
              email: email,
              role: "student" as const,
              name: `Student ${studentNumber}`,
              rollNumber: `2024CS${studentNumber.padStart(3, "0")}`,
              department: "Computer Science",
            }

            const { user, profile } = await signUp(email, password, studentProfile)
            console.log("[v0] Student account created successfully")

            // Redirect to student dashboard
            router.push("/student/dashboard")
            return
          } catch (signUpError: any) {
            console.error("[v0] Student registration error:", signUpError)
            setError(`Failed to create student account: ${signUpError.message}`)
          }
        } else {
          setError("Invalid email or password. Please check your credentials.")
        }
      } else if (error.message.includes("Admin user not found") && userType === "admin") {
        setShowAdminRegistration(true)
      } else {
        setError(error.message || "Login failed. Please check your credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAdminRegistration = async () => {
    if (!email || !password) return

    setLoading(true)
    setError("")

    try {
      console.log("[v0] Creating admin account")
      const adminProfile = {
        email: email,
        role: "admin" as const,
        name: "Dr. Rajesh Gupta",
        department: "Computer Science",
      }

      const { user, profile } = await signUp(email, password, adminProfile)
      console.log("[v0] Admin account created successfully")

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (error: any) {
      console.error("[v0] Admin registration error:", error)
      setError(error.message || "Failed to create admin account.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your KarmaPatra account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Choose your account type and enter your credentials</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {showAdminRegistration && (
                <Alert className="mb-4">
                  <UserPlus className="h-4 w-4" />
                  <AlertDescription>
                    Admin account doesn't exist. Create it now?
                    <Button
                      onClick={handleAdminRegistration}
                      variant="outline"
                      size="sm"
                      className="ml-2 bg-transparent"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Admin Account"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="admin" className="space-y-4 mt-6">
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmail("admin@college.edu")
                        setPassword("admin123")
                      }}
                      className="w-full text-xs"
                    >
                      Quick Fill Admin Credentials
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleLogin("admin")}
                    className="w-full"
                    disabled={!email || !password || loading}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {loading ? "Signing in..." : "Login as Admin"}
                  </Button>
                </TabsContent>

                <TabsContent value="student" className="space-y-4 mt-6">
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmail("student1@college.edu")
                        setPassword("student123")
                      }}
                      className="w-full text-xs"
                    >
                      Quick Fill Student Credentials
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="student-email"
                        type="email"
                        placeholder="student@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleLogin("student")}
                    className="w-full"
                    disabled={!email || !password || loading}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {loading ? "Signing in..." : "Login as Student"}
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium">Default Credentials:</p>
                  <p>
                    Admin: <span className="font-mono">admin@college.edu</span> /{" "}
                    <span className="font-mono">admin123</span>
                  </p>
                  <p>
                    Student: <span className="font-mono">student1@college.edu</span> /{" "}
                    <span className="font-mono">student123</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
