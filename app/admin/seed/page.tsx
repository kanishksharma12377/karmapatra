"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle, XCircle, Key } from "lucide-react"

export default function SeedDatabasePage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    setResult(null)

    try {
      const { seedDatabase } = await import("../../../scripts/seed-database")
      const result = await seedDatabase()
      setResult(result)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Key className="h-5 w-5" />
            Login Credentials
          </CardTitle>
          <CardDescription className="text-blue-700">
            Use these credentials to test the application after seeding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white p-3 rounded border">
            <h4 className="font-semibold text-blue-800 mb-2">Admin Login:</h4>
            <p className="text-sm">
              <strong>Email:</strong> admin@college.edu
            </p>
            <p className="text-sm">
              <strong>Password:</strong> admin123
            </p>
          </div>
          <div className="bg-white p-3 rounded border">
            <h4 className="font-semibold text-blue-800 mb-2">Student Login (any of these):</h4>
            <p className="text-sm">
              <strong>Email:</strong> arjun.sharma@student.edu
            </p>
            <p className="text-sm">
              <strong>Email:</strong> priya.patel@student.edu
            </p>
            <p className="text-sm">
              <strong>Email:</strong> rahul.kumar@student.edu
            </p>
            <p className="text-sm">
              <strong>Email:</strong> sneha.reddy@student.edu
            </p>
            <p className="text-sm">
              <strong>Password:</strong> student123 (for all students)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Seeding
          </CardTitle>
          <CardDescription>
            Populate the Firebase database with sample student data and activities for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>This will add:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>4 sample students with Firebase Auth accounts</li>
              <li>8 sample activities and submissions</li>
              <li>1 admin user with Firebase Auth account</li>
              <li>Mixed status activities (approved, pending)</li>
            </ul>
          </div>

          <Button onClick={handleSeedDatabase} disabled={isSeeding} className="w-full">
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Database
              </>
            )}
          </Button>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.success ? result.message : result.error}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
