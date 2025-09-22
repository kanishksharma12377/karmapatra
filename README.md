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
   
   - If the repository already includes a `.env.local` file, you're all set. Just run the app.
   - Otherwise, copy the example file and fill in your own keys:
     ```bash
     cp .env.example .env.local
     ```
   
   Security note: never commit real secrets to the README or the repository. Keep them in `.env.local` (already gitignored).

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

> 🎉 **That's it!** The app is ready with pre-configured Firebase backend. No additional setup needed!

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

## 🔥 Super Quick Start

1. **Clone & Install**:
   ```bash
   git clone https://github.com/kanishksharma12377/karmapatra.git
   cd karmapatra
   npm install
   ```

2. **Environment**:
   - If `.env.local` is present, skip this step
   - Else run: `cp .env.example .env.local` and add your Firebase keys

3. **Run**:
   ```bash
   npm run dev
   ```

4. **Test**: Go to [http://localhost:3000](http://localhost:3000) and use demo credentials!

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