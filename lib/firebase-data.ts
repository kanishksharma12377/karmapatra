import { db, storage } from "./firebase"
import { collection, doc, addDoc, updateDoc, getDocs, getDoc, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export interface Activity {
  id?: string
  studentId: string
  studentName: string
  rollNumber: string
  title: string
  type: string
  date: Date
  description?: string
  fileUrl?: string
  fileName?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

export interface StudentData {
  uid: string
  name: string
  rollNumber: string
  department: string
  email: string
  phone?: string
  cgpa?: number
  graduationYear?: number
  attendance?: number
}

// Activity Management
export const submitActivity = async (
  activityData: Omit<Activity, "id" | "submittedAt" | "status">,
  file?: File,
): Promise<string> => {
  let fileUrl = ""
  let fileName = ""

  if (file) {
    const fileRef = ref(storage, `activities/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(fileRef, file)
    fileUrl = await getDownloadURL(snapshot.ref)
    fileName = file.name
  }

  const activity: Omit<Activity, "id"> = {
    ...activityData,
    fileUrl,
    fileName,
    status: "pending",
    submittedAt: new Date(),
  }

  const docRef = await addDoc(collection(db, "activities"), activity)
  return docRef.id
}

export const getStudentActivities = async (studentId: string): Promise<Activity[]> => {
  // Use simple where query without orderBy to avoid composite index requirement
  const q = query(collection(db, "activities"), where("studentId", "==", studentId))

  const querySnapshot = await getDocs(q)
  const activities = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
    submittedAt: doc.data().submittedAt.toDate(),
    reviewedAt: doc.data().reviewedAt?.toDate(),
  })) as Activity[]

  // Sort by submittedAt in JavaScript instead of Firestore
  return activities.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
}

export const getAllActivities = async (): Promise<Activity[]> => {
  const q = query(collection(db, "activities"), orderBy("submittedAt", "desc"))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
    submittedAt: doc.data().submittedAt.toDate(),
    reviewedAt: doc.data().reviewedAt?.toDate(),
  })) as Activity[]
}

export const updateActivityStatus = async (activityId: string, status: "approved" | "rejected", reviewedBy: string) => {
  await updateDoc(doc(db, "activities", activityId), {
    status,
    reviewedAt: new Date(),
    reviewedBy,
  })
}

// Student Profile Management
export const updateStudentProfile = async (uid: string, data: Partial<StudentData>) => {
  await updateDoc(doc(db, "users", uid), data)
}

export const getStudentProfile = async (uid: string): Promise<StudentData | null> => {
  const docSnap = await getDoc(doc(db, "users", uid))
  return docSnap.exists() ? (docSnap.data() as StudentData) : null
}

// Realtime listeners
export const listenToStudentActivities = (
  studentId: string,
  callback: (activities: Activity[]) => void,
) => {
  const q = query(collection(db, "activities"), where("studentId", "==", studentId))
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      submittedAt: doc.data().submittedAt.toDate(),
      reviewedAt: doc.data().reviewedAt?.toDate(),
    })) as Activity[]
    activities.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    callback(activities)
  })
}

export const listenToAllActivities = (callback: (activities: Activity[]) => void) => {
  const q = query(collection(db, "activities"), orderBy("submittedAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      submittedAt: doc.data().submittedAt.toDate(),
      reviewedAt: doc.data().reviewedAt?.toDate(),
    })) as Activity[]
    callback(activities)
  })
}

// Users by role (e.g., student, admin, faculty) for counts
export const listenToUsersByRole = (
  role: "student" | "admin" | "faculty",
  callback: (users: Array<{ id: string; name: string; department?: string }>) => void,
) => {
  const q = query(collection(db, "users"), where("role", "==", role))
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    callback(users)
  })
}

// Get registered students from the registration collection
export interface RegisteredStudent {
  id: string
  name: string
  email: string
  rollNumber: string
  department: string
  phoneNumber: string
  userType: string
  status: string
  createdAt: any
  registrationDate: string
}

export const listenToRegisteredStudents = (callback: (students: RegisteredStudent[]) => void) => {
  const q = query(collection(db, "students"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as RegisteredStudent))
    callback(students)
  })
}

// Aggregate metrics derived from activities
export const computeActivityMetrics = (activities: Activity[]) => {
  const total = activities.length
  const approved = activities.filter((a) => a.status === "approved").length
  const pending = activities.filter((a) => a.status === "pending").length
  const rejected = activities.filter((a) => a.status === "rejected").length
  return { total, approved, pending, rejected }
}
