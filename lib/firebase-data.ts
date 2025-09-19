import { db, storage } from "./firebase"
import { collection, doc, addDoc, updateDoc, getDocs, getDoc, query, where, orderBy } from "firebase/firestore"
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
