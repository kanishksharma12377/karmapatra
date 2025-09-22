import { db } from "../lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

// Sample registration data for demo
const sampleRegistrations = [
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
  },
  {
    name: "Anita Sharma",
    email: "anita.sharma@student.edu",
    rollNumber: "BT21B012",
    department: "Biotechnology",
    phoneNumber: "+91 9876543215",
    userType: "student", 
    status: "active",
    registrationDate: "2025-09-22T13:10:00.000Z"
  },
  {
    name: "Rahul Verma",
    email: "rahul.verma@student.edu",
    rollNumber: "CH21B025",
    department: "Chemical Engineering",
    phoneNumber: "+91 9876543216",
    userType: "student",
    status: "active", 
    registrationDate: "2025-09-22T15:45:00.000Z"
  },
  {
    name: "Kavya Reddy",
    email: "kavya.reddy@student.edu",
    rollNumber: "EE21B008", 
    department: "Electrical Engineering",
    phoneNumber: "+91 9876543217",
    userType: "student",
    status: "active",
    registrationDate: "2025-09-22T17:20:00.000Z"
  }
]

async function seedRegistrations() {
  try {
    console.log("🌱 Seeding student registrations...")
    
    for (const registration of sampleRegistrations) {
      const docRef = await addDoc(collection(db, "students"), {
        ...registration,
        createdAt: serverTimestamp()
      })
      console.log(`✅ Added ${registration.name} with ID: ${docRef.id}`)
    }
    
    console.log(`🎉 Successfully seeded ${sampleRegistrations.length} student registrations!`)
    console.log("📊 Check your admin dashboard at /admin/dashboard → Registrations tab")
    
  } catch (error) {
    console.error("❌ Error seeding data:", error)
  }
}

// Run the seed function
seedRegistrations()
  .then(() => {
    console.log("✨ Seeding complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error)
    process.exit(1)
  })