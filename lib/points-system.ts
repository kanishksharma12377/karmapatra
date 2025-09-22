// Points System Configuration
export const POINTS_CONFIG = {
  // Activity submission points
  activities: {
    'project': 50,
    'assignment': 30,
    'quiz': 20,
    'presentation': 40,
    'lab_work': 25,
    'research': 60,
    'hackathon': 100,
    'competition': 80,
    'workshop': 30,
    'certification': 70,
    'community_service': 40,
    'leadership': 50,
    'default': 25 // fallback for unknown types
  },
  
  // Bonus multipliers for approved activities
  status_multipliers: {
    'approved': 1.0,
    'pending': 0.0, // No points until approved
    'rejected': 0.0
  },
  
  // Achievement milestones
  milestones: [
    { points: 100, title: 'Getting Started', badge: 'Beginner', color: '#8b5cf6' },
    { points: 250, title: 'Making Progress', badge: 'Learner', color: '#3b82f6' },
    { points: 500, title: 'Active Student', badge: 'Achiever', color: '#10b981' },
    { points: 750, title: 'High Performer', badge: 'Star', color: '#f59e0b' },
    { points: 1000, title: 'Excellence', badge: 'Expert', color: '#ef4444' },
    { points: 1500, title: 'Outstanding', badge: 'Champion', color: '#8b5cf6' },
    { points: 2000, title: 'Exceptional', badge: 'Master', color: '#6366f1' }
  ]
}

export interface PointsBreakdown {
  totalPoints: number
  approvedActivities: number
  pendingActivities: number
  rejectedActivities: number
  currentMilestone: typeof POINTS_CONFIG.milestones[0] | null
  nextMilestone: typeof POINTS_CONFIG.milestones[0] | null
  progressToNext: number
  pointsByType: Record<string, number>
}

// Calculate points from activities
export function calculatePoints(activities: any[]): PointsBreakdown {
  let totalPoints = 0
  let approvedCount = 0
  let pendingCount = 0
  let rejectedCount = 0
  const pointsByType: Record<string, number> = {}

  activities.forEach(activity => {
    const basePoints = POINTS_CONFIG.activities[activity.type as keyof typeof POINTS_CONFIG.activities] 
                     || POINTS_CONFIG.activities.default
    const multiplier = POINTS_CONFIG.status_multipliers[activity.status as keyof typeof POINTS_CONFIG.status_multipliers] || 0
    
    const earnedPoints = basePoints * multiplier

    if (activity.status === 'approved') {
      totalPoints += earnedPoints
      approvedCount++
      pointsByType[activity.type] = (pointsByType[activity.type] || 0) + earnedPoints
    } else if (activity.status === 'pending') {
      pendingCount++
    } else if (activity.status === 'rejected') {
      rejectedCount++
    }
  })

  // Find current and next milestones
  const milestones = POINTS_CONFIG.milestones
  let currentMilestone = null
  let nextMilestone = null

  for (let i = 0; i < milestones.length; i++) {
    if (totalPoints >= milestones[i].points) {
      currentMilestone = milestones[i]
    } else {
      nextMilestone = milestones[i]
      break
    }
  }

  // If we've reached the highest milestone
  if (!nextMilestone && currentMilestone) {
    nextMilestone = currentMilestone
  }
  
  // If we haven't reached the first milestone yet
  if (!currentMilestone) {
    nextMilestone = milestones[0]
  }

  const progressToNext = nextMilestone 
    ? Math.min(100, (totalPoints / nextMilestone.points) * 100)
    : 100

  return {
    totalPoints,
    approvedActivities: approvedCount,
    pendingActivities: pendingCount,
    rejectedActivities: rejectedCount,
    currentMilestone,
    nextMilestone,
    progressToNext,
    pointsByType
  }
}

// Get points for a specific activity type
export function getPointsForActivityType(activityType: string): number {
  return POINTS_CONFIG.activities[activityType as keyof typeof POINTS_CONFIG.activities] 
         || POINTS_CONFIG.activities.default
}