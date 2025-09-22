'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { validateAdminCredentials, getAdminProfile } from '@/lib/admin-config'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'student'
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    department: '',
    phoneNumber: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)

  // Quick fill functions for demo credentials
  const quickFillAdmin = () => {
    setLoginData({
      email: 'admin',
      password: 'admin123'
    })
  }

  const quickFillStudent = () => {
    setLoginData({
      email: 'student@demo.com',
      password: 'demo123'
    })
  }

  const quickFillRegister = () => {
    setRegisterData({
      name: 'John Doe',
      email: 'john.doe@student.edu',
      password: 'password123',
      rollNumber: 'CS2024001',
      department: 'Computer Science',
      phoneNumber: '+1234567890'
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (userType === 'admin') {
        // Admin login with configured credentials
        if (validateAdminCredentials(loginData.email, loginData.password)) {
          // Store admin data in localStorage for authentication
          const adminProfile = getAdminProfile()
          const adminData = {
            ...adminProfile,
            loginTime: new Date().toISOString()
          }
          localStorage.setItem('adminData', JSON.stringify(adminData))
          
          toast.success('Admin login successful!')
          router.push('/admin/dashboard')
        } else {
          throw new Error('Invalid admin credentials. Please check your username and password.')
        }
      } else {
        // Student login - demo authentication using localStorage
        if (loginData.email && loginData.password) {
          // Create demo student session
          const studentData = {
            uid: `student_${Date.now()}`, // Generate a unique ID
            email: loginData.email,
            name: loginData.email.split('@')[0], // Use email prefix as name
            role: 'student',
            loginTime: new Date().toISOString()
          }
          localStorage.setItem('studentData', JSON.stringify(studentData))
          
          toast.success('Student login successful!')
          router.push('/student/dashboard')
        } else {
          throw new Error('Please enter email and password')
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const registrationData = {
        ...registerData,
        userType,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('registrationData', JSON.stringify(registrationData))

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      if (response.ok) {
        toast.success('Registration successful!')
        
        if (userType === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/student/dashboard')
        }
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Dashboard Preview Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">KarmaPatra Hub</h1>
          <p className="text-xl text-gray-600 mb-8">Student Achievement & Portfolio Management System</p>
        </div>

        {/* Login Section */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {userType === 'admin' ? 'Admin Portal' : 'Student Portal'}
              </CardTitle>
              <CardDescription>
                Access your {userType === 'admin' ? 'admin' : 'student'} dashboard
              </CardDescription>
            </CardHeader>
        <CardContent>
          {userType === 'admin' ? (
            // Admin only has login, no registration
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-id">Username</Label>
                <Input
                  id="login-id"
                  type="text"
                  placeholder="Enter username"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              {/* Quick Fill Button for Admin */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full text-sm" 
                onClick={quickFillAdmin}
              >
                🚀 Quick Fill Demo Credentials (admin/admin123)
              </Button>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </form>
          ) : (
            // Students have both login and registration
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  {/* Quick Fill Button for Student */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full text-sm" 
                    onClick={quickFillStudent}
                  >
                    🚀 Quick Fill Demo Credentials (student@demo.com)
                  </Button>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-rollNumber">Roll Number</Label>
                    <Input
                      id="register-rollNumber"
                      type="text"
                      placeholder="Enter your roll number"
                      value={registerData.rollNumber}
                      onChange={(e) => setRegisterData({ ...registerData, rollNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-department">Department</Label>
                    <Input
                      id="register-department"
                      type="text"
                      placeholder="Enter your department"
                      value={registerData.department}
                      onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phoneNumber">Phone Number</Label>
                    <Input
                      id="register-phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={registerData.phoneNumber}
                      onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>

                  {/* Quick Fill Button for Registration */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full text-sm" 
                    onClick={quickFillRegister}
                  >
                    🚀 Quick Fill Demo Registration Data
                  </Button>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}