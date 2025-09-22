import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Award, BookOpen, Users, Heart, Trophy, Calendar, ExternalLink } from "lucide-react"

export default function StudentPortfolio() {
  // Mock student data
  const studentInfo = {
    name: "Priya Sharma",
    rollNumber: "CS21B1001",
    department: "Computer Science Engineering",
    university: "Indian Institute of Technology, Delhi",
    email: "priya.sharma@iitd.ac.in",
    phone: "+91 98765 43210",
    cgpa: "8.7/10.0",
    graduationYear: "2025",
  }

  const achievements = {
    academic: [
      {
        title: "Dean's List",
        description: "Achieved CGPA above 9.0 for consecutive semesters",
        date: "2023-2024",
        grade: "9.2 CGPA",
      },
      {
        title: "Best Project Award",
        description: "Machine Learning based Healthcare Diagnosis System",
        date: "Dec 2023",
        grade: "A+",
      },
    ],
    certifications: [
      {
        title: "Google Cloud Professional Developer",
        issuer: "Google Cloud",
        date: "Jan 2024",
        credentialId: "GCP-2024-001",
        link: "#",
      },
      {
        title: "AWS Solutions Architect Associate",
        issuer: "Amazon Web Services",
        date: "Nov 2023",
        credentialId: "AWS-SAA-2023-456",
        link: "#",
      },
      {
        title: "Full Stack Web Development",
        issuer: "freeCodeCamp",
        date: "Sep 2023",
        credentialId: "FCC-2023-789",
        link: "#",
      },
    ],
    extracurricular: [
      {
        title: "Google Summer of Code 2024",
        organization: "Apache Software Foundation",
        role: "Student Developer",
        date: "May - Aug 2024",
        description: "Contributed to Apache Kafka project, implemented new monitoring features",
      },
      {
        title: "Smart India Hackathon Winner",
        organization: "Government of India",
        role: "Team Lead",
        date: "Mar 2024",
        description: "Developed AI-powered traffic management system for smart cities",
      },
      {
        title: "Technical Secretary",
        organization: "Computer Science Society, IIT Delhi",
        role: "Leadership Position",
        date: "2023-2024",
        description: "Organized technical workshops and coding competitions for 500+ students",
      },
    ],
    volunteering: [
      {
        title: "Code for Good Volunteer",
        organization: "Teach for India",
        date: "2023-Present",
        hours: "120 hours",
        description: "Teaching programming fundamentals to underprivileged children",
      },
      {
        title: "Environmental Conservation Drive",
        organization: "Green Earth Foundation",
        date: "Oct 2023",
        hours: "40 hours",
        description: "Organized tree plantation drive and awareness campaigns",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/student/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Student Portfolio</h1>
                <p className="text-muted-foreground">KarmaPatra — Verified Student Portfolio</p>
              </div>
              <Button className="w-fit">
                <Download className="mr-2 h-4 w-4" />
                Download Portfolio (PDF)
              </Button>
            </div>
          </div>

          {/* Student Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{studentInfo.name}</h3>
                    <p className="text-muted-foreground">{studentInfo.rollNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium">{studentInfo.department}</p>
                    <p className="text-sm text-muted-foreground">{studentInfo.university}</p>
                  </div>
                  <div>
                    <p className="text-sm">Expected Graduation: {studentInfo.graduationYear}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">CGPA: {studentInfo.cgpa}</p>
                  </div>
                  <div>
                    <p className="text-sm">{studentInfo.email}</p>
                    <p className="text-sm">{studentInfo.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Achievements */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Academic Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.academic.map((achievement, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {achievement.date}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">{achievement.grade}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {achievements.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{cert.title}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {cert.date}
                        </span>
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Extracurricular Activities */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Extracurricular Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {achievements.extracurricular.map((activity, index) => (
                  <div key={index}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <p className="text-sm text-primary">{activity.organization}</p>
                        <p className="text-sm text-muted-foreground">{activity.role}</p>
                      </div>
                      <Badge variant="outline">{activity.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    {index < achievements.extracurricular.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Volunteering */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Volunteering & Community Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {achievements.volunteering.map((volunteer, index) => (
                  <div key={index}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{volunteer.title}</h4>
                        <p className="text-sm text-primary">{volunteer.organization}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {volunteer.date}
                          </span>
                          <span>{volunteer.hours}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{volunteer.description}</p>
                    {index < achievements.volunteering.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 border-t">
            <p className="text-sm text-muted-foreground">
              This portfolio is generated and verified by{" "}
              <span className="font-semibold text-primary">KarmaPatra (कर्मपत्र)</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Generated on {new Date().toLocaleDateString()} • All achievements are verified
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
