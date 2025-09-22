// Admin configuration for KarmaPatra Hub
// =====================================
// 
// Current Admin Credentials:
// Username: admin
// Password: admin123
// 
// To change admin credentials, modify the values below:

export const ADMIN_CONFIG = {
  credentials: {
    username: 'admin',
    password: 'admin123', // Changed from 'admin' to 'admin123' for better security
  },
  profile: {
    id: 'admin',
    name: 'System Administrator',
    email: 'admin@karmapatra.edu',
    role: 'admin'
  }
}

// Helper function to validate admin credentials
export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CONFIG.credentials.username && 
         password === ADMIN_CONFIG.credentials.password
}

// Helper function to get admin profile data
export function getAdminProfile() {
  return ADMIN_CONFIG.profile
}