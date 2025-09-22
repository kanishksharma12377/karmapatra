import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"

// Simple registration data for demo
const registrationData = [
  {
    name: "Arjun Sharma",
    email: "arjun.sharma@student.edu",
    rollNumber: "CS21B001",
    department: "Computer Science Engineering",
    phoneNumber: "+91 9876543210",
    userType: "student",
    status: "active",
    registrationDate: "2025-09-20T10:30:00.000Z"
  },
  {
    name: "Priya Patel", 
    email: "priya.patel@student.edu",
    rollNumber: "EC21B015",
    department: "Electronics & Communication",
    phoneNumber: "+91 9876543211",
    userType: "student",
    status: "active",
    registrationDate: "2025-09-21T14:15:00.000Z"
  },
  {
    name: "Rohit Kumar",
    email: "rohit.kumar@student.edu", 
    rollNumber: "ME21B032",
    department: "Mechanical Engineering",
    phoneNumber: "+91 9876543212",
    userType: "student",
    status: "active",
    registrationDate: "2025-09-21T16:45:00.000Z"
  },
  {
    name: "Sneha Gupta",
    email: "sneha.gupta@student.edu",
    rollNumber: "IT21B019",
    department: "Information Technology", 
    phoneNumber: "+91 9876543213",
    userType: "student",
    status: "active",
    registrationDate: "2025-09-22T09:20:00.000Z"
  },
  {
    name: "Vikash Singh",
    email: "vikash.singh@student.edu",
    rollNumber: "CE21B007",
    department: "Civil Engineering",
    phoneNumber: "+91 9876543214", 
    userType: "student",
    status: "active",
    registrationDate: "2025-09-22T11:30:00.000Z"
  }
]

export async function POST() {
  try {
    console.log("Starting to seed registration data...")
    
    // Add registration data
    const results = []
    for (const student of registrationData) {
      const docRef = await addDoc(collection(db, "students"), {
        ...student,
        createdAt: serverTimestamp()
      })
      results.push({
        id: docRef.id,
        name: student.name,
        rollNumber: student.rollNumber
      })
      console.log(`Added: ${student.name}`)
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully added ${results.length} student registrations!`,
      students: results
    })
    
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Failed to seed registrations", details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check current data
    const studentsSnapshot = await getDocs(collection(db, "students"))
    const students = studentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return NextResponse.json({
      success: true,
      count: students.length,
      students: students
    })
    
  } catch (error) {
    console.error("Get error:", error)
    return NextResponse.json(
      { error: "Failed to get students" },
      { status: 500 }
    )
  }
}