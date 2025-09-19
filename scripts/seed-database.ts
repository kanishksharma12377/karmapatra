import { db, auth } from "../lib/firebase"
import { collection, doc, setDoc, addDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"

// Sample student data
const sampleStudents = [
  {
    uid: "student1",
    name: "Arjun Sharma",
    rollNumber: "CS21B001",
    department: "Computer Science",
    email: "arjun.sharma@student.edu",
    phone: "+91 9876543210",
    cgpa: 8.5,
    graduationYear: 2025,
    attendance: 92,
    role: "student",
  },
  {
    uid: "student2",
    name: "Priya Patel",
    rollNumber: "EC21B015",
    department: "Electronics",
    email: "priya.patel@student.edu",
    phone: "+91 9876543211",
    cgpa: 9.1,
    graduationYear: 2025,
    attendance: 95,
    role: "student",
  },
  {
    uid: "student3",
    name: "Rahul Kumar",
    rollNumber: "ME21B032",
    department: "Mechanical",
    email: "rahul.kumar@student.edu",
    phone: "+91 9876543212",
    cgpa: 7.8,
    graduationYear: 2025,
    attendance: 88,
    role: "student",
  },
  {
    uid: "student4",
    name: "Sneha Reddy",
    rollNumber: "CS21B045",
    department: "Computer Science",
    email: "sneha.reddy@student.edu",
    phone: "+91 9876543213",
    cgpa: 8.9,
    graduationYear: 2025,
    attendance: 94,
    role: "student",
  },
  {
    uid: "admin1",
    name: "Dr. Rajesh Gupta",
    email: "admin@college.edu",
    department: "Administration",
    role: "admin",
  },
]

// Sample activities data
const sampleActivities = [
  {
    studentId: "student1",
    studentName: "Arjun Sharma",
    rollNumber: "CS21B001",
    title: "Hackathon Winner - TechFest 2024",
    type: "Competition",
    date: new Date("2024-03-15"),
    description: "Won first place in 48-hour coding hackathon with AI-powered healthcare solution",
    status: "approved",
    submittedAt: new Date("2024-03-16"),
    reviewedAt: new Date("2024-03-18"),
    reviewedBy: "Dr. Rajesh Gupta",
  },
  {
    studentId: "student1",
    studentName: "Arjun Sharma",
    rollNumber: "CS21B001",
    title: "Research Paper Published",
    type: "Research",
    date: new Date("2024-02-20"),
    description: "Published paper on 'Machine Learning in Healthcare' in IEEE conference",
    status: "approved",
    submittedAt: new Date("2024-02-22"),
    reviewedAt: new Date("2024-02-24"),
    reviewedBy: "Dr. Rajesh Gupta",
  },
  {
    studentId: "student2",
    studentName: "Priya Patel",
    rollNumber: "EC21B015",
    title: "Internship at Samsung R&D",
    type: "Internship",
    date: new Date("2024-01-10"),
    description: "3-month internship in semiconductor design team",
    status: "approved",
    submittedAt: new Date("2024-04-15"),
    reviewedAt: new Date("2024-04-17"),
    reviewedBy: "Dr. Rajesh Gupta",
  },
  {
    studentId: "student2",
    studentName: "Priya Patel",
    rollNumber: "EC21B015",
    title: "IEEE Student Chapter Secretary",
    type: "Leadership",
    date: new Date("2024-01-01"),
    description: "Elected as Secretary of IEEE Student Chapter, organized 5 technical events",
    status: "approved",
    submittedAt: new Date("2024-01-05"),
    reviewedAt: new Date("2024-01-07"),
    reviewedBy: "Dr. Rajesh Gupta",
  },
  {
    studentId: "student3",
    studentName: "Rahul Kumar",
    rollNumber: "ME21B032",
    title: "CAD Design Competition - 2nd Place",
    type: "Competition",
    date: new Date("2024-02-28"),
    description: "Secured second place in national level CAD design competition",
    status: "pending",
    submittedAt: new Date("2024-03-01"),
  },
  {
    studentId: "student3",
    studentName: "Rahul Kumar",
    rollNumber: "ME21B032",
    title: "Volunteer at NGO",
    type: "Social Service",
    date: new Date("2024-01-15"),
    description: "Volunteered for 40 hours at local NGO for education initiative",
    status: "approved",
    submittedAt: new Date("2024-01-20"),
    reviewedAt: new Date("2024-01-22"),
    reviewedBy: "Dr. Rajesh Gupta",
  },
  {
    studentId: "student4",
    studentName: "Sneha Reddy",
    rollNumber: "CS21B045",
    title: "Google Summer of Code 2024",
    type: "Open Source",
    date: new Date("2024-05-01"),
    description: "Selected for GSoC 2024, contributing to Apache Software Foundation",
    status: "approved",
    submittedAt: new Date("2024-05-05"),
    reviewedAt: new Date("2024-05-07"),
    reviewedBy: "Dr. Rajesh Gupta",
  },
  {
    studentId: "student4",
    studentName: "Sneha Reddy",
    rollNumber: "CS21B045",
    title: "Mobile App Development Workshop",
    type: "Workshop",
    date: new Date("2024-04-10"),
    description: "Conducted 2-day workshop on React Native for junior students",
    status: "pending",
    submittedAt: new Date("2024-04-12"),
  },
]

export async function seedDatabase() {
  try {
    console.log("[v0] Starting database seeding...")

    console.log("[v0] Creating Firebase Auth users...")
    for (const student of sampleStudents) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, student.email, "student123")
        console.log(`[v0] Created Auth user: ${student.email}`)

        // Create Firestore document with the actual UID from Firebase Auth
        const { email, password, ...userDoc } = student // Remove email and password from Firestore doc
        await setDoc(doc(db, "users", userCredential.user.uid), {
          ...userDoc,
          uid: userCredential.user.uid,
        })
        console.log(`[v0] Added Firestore document for: ${student.name}`)
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          console.log(`[v0] User ${student.email} already exists, skipping...`)
        } else {
          console.error(`[v0] Error creating user ${student.email}:`, error)
        }
      }
    }

    // Admin user creation
    const admin = sampleStudents.find((student) => student.role === "admin")
    if (admin) {
      try {
        const adminCredential = await createUserWithEmailAndPassword(auth, admin.email, "admin123")
        console.log(`[v0] Created Auth user: ${admin.email}`)

        // Create Firestore document with the actual UID from Firebase Auth
        const { email, password, ...adminDoc } = admin // Remove email and password from Firestore doc
        await setDoc(doc(db, "users", adminCredential.user.uid), {
          ...adminDoc,
          uid: adminCredential.user.uid,
        })
        console.log(`[v0] Added Firestore document for: ${admin.name}`)
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          console.log(`[v0] User ${admin.email} already exists, skipping...`)
        } else {
          console.error(`[v0] Error creating user ${admin.email}:`, error)
        }
      }
    }

    console.log("[v0] Adding sample activities...")
    for (const activity of sampleActivities) {
      await addDoc(collection(db, "activities"), activity)
      console.log(`[v0] Added activity: ${activity.title}`)
    }

    console.log("[v0] Database seeding completed successfully!")
    return { success: true, message: "Database seeded with sample data" }
  } catch (error) {
    console.error("[v0] Error seeding database:", error)
    return { success: false, error: error.message }
  }
}

// Run the seed function
seedDatabase()
