import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { GraduationCap, Award, FileText, BarChart3, Shield } from "lucide-react"
import { User } from "lucide-react" // Import User component

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <GraduationCap className="h-16 w-16 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            <span className="text-primary">KarmaPatra</span>
            <br />
            <span className="text-2xl md:text-3xl text-muted-foreground">(कर्मपत्र)</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
            A centralized platform for managing student achievements
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/login?type=student">
                <User className="mr-2 h-5 w-5" />
                Login as Student
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/login?type=admin">
                <Shield className="mr-2 h-5 w-5" />
                Login as Admin
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Track Achievements</CardTitle>
              <CardDescription>Centralize all your academic and extracurricular accomplishments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-accent/20 w-fit mb-4">
                <FileText className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle>Digital Portfolio</CardTitle>
              <CardDescription>Generate professional portfolios with verified achievements</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Comprehensive insights for administrators and students</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">1000+</div>
                <div className="text-primary-foreground/80">Students Registered</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">5000+</div>
                <div className="text-primary-foreground/80">Achievements Tracked</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-primary-foreground/80">Institutions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
