import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

type SeedBody = {
  extraStudents?: number
  extraActivities?: number
}

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Krishna", "Ishaan", "Rohan", "Kabir",
  "Ananya", "Diya", "Jiya", "Saanvi", "Aadhya", "Pari", "Ira", "Myra", "Riya", "Sara",
]
const lastNames = ["Sharma", "Verma", "Patel", "Gupta", "Agarwal", "Khan", "Singh", "Reddy", "Iyer", "Das"]
const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "IT"]
const extraTitles = [
  "Attended Kubernetes Workshop",
  "Coursera Cloud Computing Specialization",
  "Volunteered at Blood Donation Camp",
  "Presented Poster at National Symposium",
  "Open Source PR Merged",
  "Won Debugging Contest",
  "Organized Hack Night",
]
const extraTypes = [
  "Workshop",
  "Certification",
  "Volunteering",
  "Conference",
  "Open Source",
  "Competition",
  "Club Activities",
]

function pick<T>(arr: readonly T[] | T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randomDate(start: Date, end: Date) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())) }
function makeRoll(dept: string, index: number) { const code = dept.split(" ")[0].slice(0,2).toUpperCase(); return `${code}21B${String(index).padStart(3, "0")}` }

export async function POST(req: Request) {
  if (!adminDb || !adminAuth) {
    return NextResponse.json({ success: false, error: "Admin SDK not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars." }, { status: 500 })
  }

  const body = (await req.json()) as SeedBody
  const extraStudents = Number.isFinite(body?.extraStudents) ? body.extraStudents! : 0
  const extraActivities = Number.isFinite(body?.extraActivities) ? body.extraActivities! : 20

  try {
    // Ensure base admin account
    const adminEmail = "admin@college.edu"
    let adminUid: string
    try {
      const user = await adminAuth.getUserByEmail(adminEmail)
      adminUid = user.uid
    } catch {
      const user = await adminAuth.createUser({ email: adminEmail, password: "admin123", displayName: "Dr. Rajesh Gupta" })
      adminUid = user.uid
    }
    await adminDb.collection("users").doc(adminUid).set({
      uid: adminUid,
      name: "Dr. Rajesh Gupta",
      email: adminEmail,
      department: "Administration",
      role: "admin",
    }, { merge: true })

    // Create random students
    const createdStudents: Array<{ uid: string; name: string; rollNumber: string }> = []
    for (let i = 1; i <= extraStudents; i++) {
      const first = pick(firstNames), last = pick(lastNames)
      const name = `${first} ${last}`
      const department = pick(departments)
      const rollNumber = makeRoll(department, 100 + i)
      const email = `${first.toLowerCase()}.${last.toLowerCase()}${100 + i}@student.edu`
      let uid: string
      try {
        const u = await adminAuth.getUserByEmail(email)
        uid = u.uid
      } catch {
        const u = await adminAuth.createUser({ email, password: "student123", displayName: name })
        uid = u.uid
      }
      await adminDb.collection("users").doc(uid).set({
        uid,
        name,
        rollNumber,
        department,
        email,
        cgpa: Math.round((6 + Math.random() * 4) * 10) / 10,
        graduationYear: 2025,
        attendance: Math.floor(80 + Math.random() * 20),
        role: "student",
      }, { merge: true })
      createdStudents.push({ uid, name, rollNumber })
    }

    // Generate activities
    const studentsForActivities = createdStudents.length ? createdStudents : [{ uid: adminUid, name: "Demo Student", rollNumber: "CS21B000" }]
    for (let i = 0; i < extraActivities; i++) {
      const s = pick(studentsForActivities)
      const date = randomDate(new Date("2024-01-01"), new Date())
      const submittedAt = new Date(date.getTime() + 24 * 60 * 60 * 1000)
      const statuses = ["approved", "pending", "rejected"] as const
      const status = pick<typeof statuses[number]>(statuses)
      const reviewedAt = status === "pending" ? null : new Date(submittedAt.getTime() + 2 * 24 * 60 * 60 * 1000)
      const reviewedBy = status === "pending" ? null : "Dr. Rajesh Gupta"
      
      // Build activity object without undefined values
      const activityData: any = {
        studentId: s.uid,
        studentName: s.name,
        rollNumber: s.rollNumber,
        title: pick(extraTitles),
        type: pick(extraTypes),
        date,
        description: "Auto-generated demo activity",
        status,
        submittedAt,
      }
      
      // Only add reviewedAt and reviewedBy if they have values
      if (reviewedAt) {
        activityData.reviewedAt = reviewedAt
      }
      if (reviewedBy) {
        activityData.reviewedBy = reviewedBy
      }
      
      await adminDb.collection("activities").add(activityData)
    }

    return NextResponse.json({ success: true, message: `Seeded ${extraStudents} students and ${extraActivities} activities.` })
  } catch (e: any) {
    console.error("Seed API error:", e)
    return NextResponse.json({ success: false, error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}