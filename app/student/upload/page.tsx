"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ArrowLeft, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuthState } from "@/hooks/use-auth"
import { submitActivity } from "@/lib/firebase-data"
import { toast } from "sonner"

export default function UploadActivityPage() {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    description: "",
    file: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user, profile } = useAuthState()

  const activityTypes = ["Conference", "Workshop", "Internship", "Certification", "Volunteering", "Competition"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) {
      toast.error("You must be logged in to submit an activity")
      return
    }
    setIsSubmitting(true)
    try {
      // Basic validation
      if (!formData.title || !formData.type || !formData.date) {
        toast.error("Please fill all required fields")
        return
      }
      const activityId = await submitActivity(
        {
          studentId: user.uid,
          studentName: profile.name,
          rollNumber: profile.rollNumber || "",
          title: formData.title,
          type: formData.type,
          date: new Date(formData.date),
          description: formData.description,
        },
        formData.file ?? undefined,
      )
      toast.success("Activity submitted for review")
      router.push("/student/dashboard")
    } catch (err) {
      console.error("[upload] submit error", err)
      toast.error("Failed to submit activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/student/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-primary mb-2">Upload Activity</h1>
            <p className="text-muted-foreground">Submit your achievements for verification and portfolio inclusion</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Activity Details
              </CardTitle>
              <CardDescription>Fill in the details of your activity or achievement</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Google Summer of Code 2024"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Activity Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional details about your activity..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Supporting Document</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="file" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">Click to upload</span>
                        <span className="text-muted-foreground"> or drag and drop</span>
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <p className="text-xs text-muted-foreground">PDF, DOC, or image files (max 10MB)</p>
                      {formData.file && <p className="text-sm text-primary">Selected: {formData.file.name}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.type || !formData.date}
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Activity"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/student/dashboard">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
