import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export async function GET() {
  try {
    // Get all students from Firestore
    const studentsQuery = query(
      collection(db, "students"), 
      orderBy("createdAt", "desc")
    )
    
    const querySnapshot = await getDocs(studentsQuery)
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return NextResponse.json({
      success: true,
      students: students,
      total: students.length
    })
    
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}