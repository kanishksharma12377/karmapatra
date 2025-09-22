"use client"

import React, { useState, useEffect } from 'react'
import {
  Bell,
  CheckCircle,
  Clock,
  CircleX,
  PlusCircle,
  User,
  Activity,
  LogOut,
  ShieldCheck,
  Briefcase,
  Layers,
  BarChart,
  Download,
  BookOpen,
  Trophy,
  ClipboardCheck,
  Lightbulb,
  Award,
  Users,
  Code,
  Globe,
  Star,
  Zap,
  Home,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Charts removed from home page admin view as requested

// Types
type ActivityStatus = 'Approved' | 'Pending' | 'Rejected'

type ActivityItem = {
  id: number
  title: string
  description: string
  category: string
  date: string
  userId: string
  status: ActivityStatus
  proof: string
  rejectionReason?: string
}

type UserItem = {
  id: string
  name: string
  role: 'student' | 'admin'
}

type ToastType = 'success' | 'error'

// Mock data to simulate a student's activities
const mockActivities: ActivityItem[] = [
  {
    id: 1,
    title: 'Attended Web Development Conference',
    description: 'Participated in a three-day conference on modern web development trends.',
    category: 'Conference',
    date: '2024-09-15',
    userId: 'user-001',
    status: 'Approved',
    proof: 'conference_certificate.pdf',
  },
  {
    id: 2,
    title: 'MOOC on Data Structures',
    description: 'Completed a 10-week online course on Data Structures and Algorithms with a certification.',
    category: 'Certification',
    date: '2024-08-20',
    userId: 'user-001',
    status: 'Pending',
    proof: 'mooc_certificate.pdf',
  },
  {
    id: 3,
    title: 'Volunteered at Community Clean-up',
    description: 'Contributed to a local community clean-up drive organized by the city municipality.',
    category: 'Community Service',
    date: '2024-07-10',
    userId: 'user-002',
    status: 'Approved',
    proof: 'cleanup_photo.jpg',
  },
  {
    id: 4,
    title: 'Participated in National Coding Competition',
    description: 'Took part in a national-level coding competition, solving complex algorithmic problems.',
    category: 'Competition',
    date: '2024-06-05',
    userId: 'user-001',
    status: 'Rejected',
    proof: 'competition_rank.pdf',
    rejectionReason: 'Proof of participation was invalid.',
  },
  {
    id: 5,
    title: 'Completed Machine Learning Internship',
    description: 'Worked as an intern on a project involving predictive modeling for a small startup.',
    category: 'Internship',
    date: '2024-05-30',
    userId: 'user-002',
    status: 'Approved',
    proof: 'internship_letter.pdf',
  },
  {
    id: 6,
    title: 'Leadership Role in a club',
    description: 'Served as the team lead for the college robotics club, mentoring new members.',
    category: 'Leadership',
    date: '2024-09-20',
    userId: 'user-001',
    status: 'Pending',
    proof: 'club_letter.pdf',
  },
  {
    id: 7,
    title: 'Organized a college event',
    description: 'Successfully organized and managed a technical workshop for over 100 students.',
    category: 'Volunteering',
    date: '2024-08-25',
    userId: 'user-002',
    status: 'Pending',
    proof: 'event_photo.jpg',
  },
]

const mockUsers: UserItem[] = [
  {
    id: 'user-001',
    name: 'John Doe',
    role: 'student',
  },
  {
    id: 'user-002',
    name: 'Jane Smith',
    role: 'student',
  },
  {
    id: 'admin-001',
    name: 'Admin User',
    role: 'admin',
  },
]

const activityCategories = [
  'Conference',
  'Certification',
  'Club Activities',
  'Volunteering',
  'Competition',
  'Leadership',
  'Internship',
  'Community Service',
  'Other',
]

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string
  type: ToastType
  onClose: () => void
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg font-medium text-white ${bgColor}`}
    >
      {message}
    </motion.div>
  )
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Conference':
      return <BookOpen className="w-5 h-5" />
    case 'Certification':
      return <Trophy className="w-5 h-5" />
    case 'Club Activities':
      return <Users className="w-5 h-5" />
    case 'Volunteering':
      return <ClipboardCheck className="w-5 h-5" />
    case 'Competition':
      return <Code className="w-5 h-5" />
    case 'Leadership':
      return <Star className="w-5 h-5" />
    case 'Internship':
      return <Briefcase className="w-5 h-5" />
    case 'Community Service':
      return <Globe className="w-5 h-5" />
    default:
      return <Lightbulb className="w-5 h-5" />
  }
}

const ProfileCard = ({
  user,
  studentActivities,
}: {
  user: UserItem
  studentActivities: ActivityItem[]
}) => {
  const approvedActivities = studentActivities.filter((a) => a.status === 'Approved').length
  const pendingActivities = studentActivities.filter((a) => a.status === 'Pending').length
  const rejectedActivities = studentActivities.filter((a) => a.status === 'Rejected').length
  const completionPercentage = Math.round((approvedActivities / (studentActivities.length || 1)) * 100)

  const handleDownloadPortfolio = () => {
    let content = `Student Portfolio for ${user.name}\n\n`
    const approved = studentActivities.filter((a) => a.status === 'Approved')
    approved.forEach((activity) => {
      content += `Title: ${activity.title}\nCategory: ${activity.category}\nDate: ${activity.date}\nDescription: ${activity.description}\n\n`
    })
    alert('Mock PDF download initiated. In a real app, this would generate a PDF.')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col items-center text-center"
    >
      <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-4xl font-bold mb-4">
        {user.name.charAt(0)}
      </div>
      <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
      <p className="text-sm text-gray-500 mb-6">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>

      {/* Portfolio Progress */}
      <div className="w-full mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Portfolio Progress</h4>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
        </div>
        <p className="text-right text-xs font-medium text-gray-600 mt-1">{completionPercentage}% Completed</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 text-left">
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-xl font-semibold text-gray-900">{studentActivities.length}</p>
          <p className="text-xs text-gray-500">Total Activities</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-xl font-semibold text-emerald-500">{approvedActivities}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-xl font-semibold text-yellow-500">{pendingActivities}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-xl font-semibold text-rose-500">{rejectedActivities}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
      </div>

      <div className="mt-6 w-full">
        <button
          onClick={handleDownloadPortfolio}
          className="w-full flex items-center justify-center py-3 px-4 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Portfolio
        </button>
      </div>
    </motion.div>
  )
}

const StudentDashboard = ({
  user,
  studentActivities,
  handleAddActivity,
  showCustomToast,
}: {
  user: UserItem
  studentActivities: ActivityItem[]
  handleAddActivity: (a: ActivityItem) => void
  showCustomToast: (message: string, type?: ToastType) => void
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formState, setFormState] = useState<{
    title: string
    description: string
    category: string
    date: string
    proof: File | null
  }>({
    title: '',
    description: '',
    category: '',
    date: '',
    proof: null,
  })
  const [filterStatus, setFilterStatus] = useState<'All' | ActivityStatus>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      proof: e.target.files ? e.target.files[0] : null,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.title || !formState.category || !formState.date) {
      showCustomToast('Please fill out all required fields.', 'error')
      return
    }

    const newActivity: ActivityItem = {
      id: Math.random(),
      title: formState.title,
      description: formState.description,
      category: formState.category,
      date: formState.date,
      userId: user.id,
      status: 'Pending',
      proof: formState.proof ? formState.proof.name : 'N/A',
    }

    handleAddActivity(newActivity)
    setFormState({ title: '', description: '', category: '', date: '', proof: null })
    setIsFormOpen(false)
  }

  const filteredActivities = studentActivities
    .filter((activity) => filterStatus === 'All' || activity.status === filterStatus)
    .filter((activity) => activity.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-emerald-500 w-5 h-5" />
      case 'Pending':
        return <Clock className="text-yellow-500 w-5 h-5" />
      case 'Rejected':
        return <CircleX className="text-rose-500 w-5 h-5" />
      default:
        return null
    }
  }

  const getStatusClasses = (status: ActivityStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Rejected':
        return 'bg-rose-100 text-rose-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <>
      <ProfileCard user={user} studentActivities={studentActivities} />
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl font-bold text-gray-900">Your Activities</h2>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Activity
            </button>
          </div>
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 mt-4"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Submit New Activity</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Activity Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formState.title}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="e.g., Attended Python Workshop"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={formState.description}
                      onChange={handleFormChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="e.g., Describe the key takeaways or your role in the activity."
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={formState.category}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select a category</option>
                      {activityCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={formState.date}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="proof" className="block text-sm font-medium text-gray-700">
                      Proof (Optional)
                    </label>
                    <input
                      type="file"
                      name="proof"
                      id="proof"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:scale-105"
                  >
                    Submit Activity
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow w-full rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filterStatus === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('Approved')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filterStatus === 'Approved' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('Pending')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filterStatus === 'Pending' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-1 space-y-1 sm:space-y-0 flex items-center space-x-3">
                    <span className="text-gray-500">{getCategoryIcon(activity.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(activity.status)} flex items-center space-x-1`}
                    >
                      {getStatusIcon(activity.status)}
                      <span>{activity.status}</span>
                    </span>
                    <p className="text-sm text-gray-500">
                      <span className="hidden sm:inline-block">Date: </span>
                      {activity.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No activities match your search or filter criteria.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const AdminPanel = ({
  allActivities,
  handleUpdateActivityStatus,
}: {
  allActivities: ActivityItem[]
  handleUpdateActivityStatus: (id: number, status: ActivityStatus) => void
}) => {
  const pendingActivities = allActivities.filter((a) => a.status === 'Pending')
  const approvedActivities = allActivities.filter((a) => a.status === 'Approved')
  const rejectedActivities = allActivities.filter((a) => a.status === 'Rejected')
  const totalStudents = new Set(allActivities.map((a) => a.userId)).size

  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Overall Stats (charts removed) */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3">
            <Layers className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{allActivities.length}</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-emerald-500">{approvedActivities.length}</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-yellow-500">{pendingActivities.length}</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3">
            <User className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>
        <button className="mt-6 w-full flex items-center justify-center py-3 px-4 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
          <Download className="w-4 h-4 mr-2" />
          Generate Full Report
        </button>
      </div>
      {/* Pending Activities Section */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium">
            {pendingActivities.length} Pending
          </span>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingActivities.length > 0 ? (
            pendingActivities.map((activity) => (
              <div key={activity.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex-1 space-y-1 md:space-y-0 md:mr-4 flex items-center space-x-3">
                  <span className="text-gray-500">{getCategoryIcon(activity.category)}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-600">Category:</span> {activity.category}
                    </p>
                    <p className="text-xs text-gray-400">
                      <span className="font-medium text-gray-600">Submitted by:</span>{' '}
                      {mockUsers.find((u) => u.id === activity.userId)?.name || 'Unknown User'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <button
                    onClick={() => handleUpdateActivityStatus(activity.id, 'Approved')}
                    className="inline-flex items-center px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-medium hover:bg-emerald-600 transition duration-300"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateActivityStatus(activity.id, 'Rejected')}
                    className="inline-flex items-center px-3 py-1.5 bg-rose-500 text-white rounded-full text-xs font-medium hover:bg-rose-600 transition duration-300"
                  >
                    <CircleX className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No activities require approval at this time.</p>
          )}
        </div>
      </div>
    </div>
  )
}

const AboutKarmapatra = () => {
  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Karmapatra (कर्म-पत्र) - The Smart Student Hub</h2>
      <p className="text-gray-600 mb-6 max-w-4xl mx-auto text-center">
        Karmapatra (कर्म-पत्र) is a smart, centralized digital platform designed for higher education institutions. It solves the problem of scattered student records by providing a single hub for managing all academic and extracurricular achievements.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 p-6 rounded-2xl shadow-sm text-center"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Track Achievements</h3>
          <p className="text-sm text-gray-500">Centralize all your academic and extracurricular accomplishments.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 p-6 rounded-2xl shadow-sm text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Portfolio</h3>
          <p className="text-sm text-gray-500">Generate professional portfolios with verified achievements.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 p-6 rounded-2xl shadow-sm text-center"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <BarChart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-sm text-gray-500">Comprehensive insights for administrators and students.</p>
        </motion.div>
      </div>
    </div>
  )
}



const App = () => {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities)
  const [user, setUser] = useState<UserItem | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<ToastType>('success')

  const showCustomToast = (message: string, type: ToastType = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/login'
  }

  const handleLogout = () => {
    setUser(null)
    showCustomToast('Logged out successfully!')
  }

  const handleAddActivity = (newActivity: ActivityItem) => {
    setActivities([newActivity, ...activities])
    showCustomToast('Activity submitted successfully!')
  }

  const handleUpdateActivityStatus = (id: number, newStatus: ActivityStatus) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === id ? { ...activity, status: newStatus } : activity,
    )
    setActivities(updatedActivities)
    showCustomToast(`Activity ${newStatus.toLowerCase()} successfully!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {!user ? (
            <div className="w-full lg:col-span-3 flex flex-col items-center justify-center space-y-8">
              <AboutKarmapatra />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <Zap className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                <p className="text-gray-500 mb-6">Please log in to your dashboard.</p>
                <div className="w-full max-w-sm mx-auto">
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Go to Login Page
                  </button>
                </div>
              </motion.div>
            </div>
          ) : user.role === 'student' ? (
            <StudentDashboard
              user={user}
              studentActivities={activities.filter((a) => a.userId === user.id)}
              handleAddActivity={handleAddActivity}
              showCustomToast={showCustomToast}
            />
          ) : (
            <AdminPanel allActivities={activities} handleUpdateActivityStatus={handleUpdateActivityStatus} />
          )}
        </main>
      </div>
      <AnimatePresence>
        {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
      </AnimatePresence>
    </div>
  )
}

export default App
