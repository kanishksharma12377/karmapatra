# KarmaPatra Hub

**Student Achievement & Portfolio Management System**

A modern Next.js application for managing student achievements, portfolios, and academic progress with real-time analytics and milestone tracking.

## ✨ Features

- 🎯 **Admin Dashboard** - Real-time analytics, student approval system, and comprehensive reporting
- 📊 **Student Dashboard** - Points system, milestone tracking, and achievement badges
- 🔥 **Firebase Integration** - Real-time database with secure authentication
- 🎨 **Modern UI** - Responsive design with dark/light theme support
- 🚀 **Quick Demo** - Pre-filled credentials for instant testing
- 📈 **Progress Tracking** - Visual charts and progress indicators
- 🏆 **Achievement System** - Points-based rewards and milestone badges

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Git**
- **Firebase Account** (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kanishksharma12377/karmapatra.git
   cd karmapatra
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Firebase Admin SDK (for server-side operations)
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
   ```

4. **Firebase Setup**
   
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable **Firestore Database** and **Authentication**
   - Copy your config values to `.env.local`

5. **Configure Firestore Rules**
   
   In Firebase Console → Firestore Database → Rules, paste:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write access to all documents
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Demo Credentials

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- **URL**: [http://localhost:3000/login?type=admin](http://localhost:3000/login?type=admin)

### Student Login
- **Email**: `student@demo.com`
- **Password**: `demo123`
- **URL**: [http://localhost:3000/login?type=student](http://localhost:3000/login?type=student)

> 💡 **Tip**: Use the "🚀 Quick Fill Demo Credentials" buttons on login forms for instant access!

## 📁 Project Structure

```
karmapatra/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── student/           # Student dashboard pages
│   ├── api/               # API routes
│   └── login/             # Authentication pages
├── components/            # Reusable UI components
│   └── ui/               # Shadcn/ui components
├── lib/                   # Utilities and configurations
│   ├── firebase.ts       # Firebase client config
│   ├── firebase-admin.ts # Firebase admin config
│   ├── points-system.ts  # Points calculation logic
│   └── admin-config.ts   # Admin credentials
├── hooks/                 # Custom React hooks
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔧 Key Features Guide

### Admin Panel
- **Dashboard Analytics** - View real-time student statistics
- **Approval System** - Review and approve student submissions
- **Data Export** - Export student data as CSV
- **Seed Data** - Generate sample data for testing

### Student Panel  
- **Points Tracking** - View earned points and milestones
- **Portfolio Management** - Upload and manage achievements
- **Progress Visualization** - Track academic progress
- **Achievement Badges** - Unlock milestones and rewards

### Authentication
- **Role-based Access** - Separate admin and student portals
- **Demo Mode** - Quick access with pre-filled credentials
- **Secure Logout** - Clean session management

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding Sample Data

1. Login as admin
2. Go to `/admin/seed` page
3. Click "Seed Sample Data" to populate with demo content

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app is compatible with any platform supporting Next.js:
- **Netlify**
- **Railway** 
- **Digital Ocean**
- **AWS Amplify**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/kanishksharma12377/karmapatra/issues) page
2. Create a new issue with detailed description
3. Include error messages and screenshots if applicable

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Firebase](https://firebase.google.com/)
- Charts by [Recharts](https://recharts.org/)

---

**Made with ❤️ for educational institutions**