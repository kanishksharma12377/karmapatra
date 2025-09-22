import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    console.log("Student Registration Data:", data)
    
    // Simple validation
    if (!data.name || !data.email || !data.rollNumber) {
      return NextResponse.json(
        { error: "Name, email, and roll number are required" },
        { status: 400 }
      )
    }
    
    // Save to Firebase Firestore
    const registration = {
      name: data.name,
      email: data.email,
      rollNumber: data.rollNumber,
      department: data.department,
      phoneNumber: data.phoneNumber,
      userType: data.userType || 'student',
      status: "active",
      createdAt: serverTimestamp(),
      registrationDate: new Date().toISOString()
    }
    
    // Add document to Firestore
    const docRef = await addDoc(collection(db, "students"), registration)
    
    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully",
      registrationId: docRef.id
    })
    
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    )
  }
}