#  VibeFlow🚀

<div align="center">

![VibeFlow Logo](public/favicon.svg)

**An intelligent AI-powered task management and documentation generation platform**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-vibeflowdev.vercel.app-blue?style=for-the-badge)](https://vibeflowdev.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://gemini.google.com/)
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

VibeFlow AI Tasks is a comprehensive AI-powered platform that transforms document processing and task management. Upload any document (PDF, text, etc.), and our intelligent system will automatically extract content, generate structured tasks, create documentation, and provide actionable insights using advanced AI technologies.

### 🎯 Key Capabilities

- **🤖 AI Document Processing**: Intelligent extraction and analysis of uploaded documents
- **📋 Smart Task Generation**: Automatic creation of structured, prioritized tasks
- **📚 Documentation Generation**: Automated creation of technical documentation
- **🔄 Project Management**: Comprehensive project tracking and organization
- **📊 Analytics Dashboard**: Insights and metrics for productivity tracking
- **🔐 Secure Authentication**: User management with Clerk authentication

## ✨ Features

### 🔧 Core Features

- **Document Upload & Processing**
  - Support for PDF, text, and various document formats
  - AI-powered content extraction using Google Gemini
  - Intelligent text processing with LangChain

- **Task Management**
  - Automatic task generation from documents
  - Priority-based task organization
  - Progress tracking and completion metrics
  - Task editing and customization

- **Documentation Generation**
  - Auto-generated technical documentation
  - Best practices recommendations
  - Template-based documentation creation
  - Export capabilities

- **Project Organization**
  - Multi-project support
  - Project-specific task management
  - Resource allocation and planning
  - Timeline and milestone tracking

### 🎨 User Experience

- **Modern UI/UX**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching support
- **Interactive Components**: Hover effects, animations, and micro-interactions
- **Accessibility**: WCAG compliant design principles

### 🔐 Security & Authentication

- **Clerk Integration**: Secure user authentication and management
- **Protected Routes**: Role-based access control
- **Data Encryption**: Secure data handling and storage
- **CORS Configuration**: Proper cross-origin resource sharing

## 🌐 Live Demo

**Production URL**: [https://vibeflowdev.vercel.app](https://vibeflowdev.vercel.app)

Experience the full functionality of VibeFlow AI Tasks with our live demo. The application includes:
- Sample document processing
- Task generation examples
- Interactive dashboard
- Real-time AI processing

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### AI & Document Processing
- **Google Gemini API** - Advanced AI processing
- **LangChain** - AI framework for document processing
- **PDF.js** - PDF parsing and processing
- **pdf-lib** - PDF manipulation

### UI Components & Icons
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **React Day Picker** - Date selection
- **Sonner** - Toast notifications

### Development & Deployment
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vercel** - Deployment platform
- **Git** - Version control
- **GitHub Actions** - CI/CD pipelines

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn** or **bun**
- **Git**
- **Google Gemini API Key**
- **Clerk Account** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vibe-flow-ai-tasks.git
   cd vibe-flow-ai-tasks
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Configuration**

   Create `.env` files for both frontend and backend:

   **Frontend `.env`:**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_API_URL=http://localhost:3001
   ```

   **Backend `.env`:**
   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Start development servers**

   **Frontend:**
   ```bash
   npm run dev
   ```

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

### Quick Start Guide

1. **Sign up/Login** using Clerk authentication
2. **Upload a document** (PDF, text file)
3. **Let AI process** the document automatically
4. **Review generated tasks** and customize as needed
5. **Track progress** using the dashboard
6. **Generate documentation** for your projects

## 📁 Project Structure

```
vibe-flow-ai-tasks/
├── 📁 public/                    # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt
├── 📁 src/                       # Frontend source code
│   ├── 📁 components/            # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── DocumentUpload.tsx    # Document upload component
│   │   ├── TaskViewer.tsx        # Task management component
│   │   ├── ProjectDetail.tsx     # Project detail view
│   │   └── TaskManagement.tsx    # Task management interface
│   ├── 📁 contexts/              # React contexts
│   │   ├── AuthContext.tsx       # Authentication context
│   │   └── ProjectContext.tsx    # Project state management
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx        # Mobile detection hook
│   │   └── use-toast.ts          # Toast notification hook
│   ├── 📁 lib/                   # Utility libraries
│   │   └── utils.ts              # Common utilities
│   ├── 📁 pages/                 # Page components
│   │   ├── Index.tsx             # Main dashboard
│   │   ├── Projects.tsx          # Projects page
│   │   ├── Analytics.tsx         # Analytics dashboard
│   │   ├── Documentation.tsx     # Documentation page
│   │   └── Settings.tsx          # Settings page
│   ├── 📁 services/              # API services
│   │   ├── api.ts                # Main API service
│   │   ├── authService.ts        # Authentication service
│   │   ├── projectService.ts     # Project management service
│   │   ├── taskService.ts        # Task management service
│   │   ├── pdfService.ts         # PDF processing service
│   │   └── enhancedGeminiService.ts # AI processing service
│   ├── App.tsx                   # Main App component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── 📁 backend/                   # Backend source code
│   ├── 📁 src/                   # Backend source files
│   │   ├── 📁 config/            # Configuration files
│   │   │   └── database.ts       # Database configuration
│   │   ├── 📁 controllers/       # Route controllers
│   │   │   ├── userController.ts # User management
│   │   │   ├── projectController.ts # Project management
│   │   │   └── taskController.ts # Task management
│   │   ├── 📁 middleware/        # Express middleware
│   │   │   ├── auth.ts           # Authentication middleware
│   │   │   └── validation.ts     # Input validation
│   │   ├── 📁 models/            # Database models
│   │   ├── 📁 routes/            # API routes
│   │   └── index.ts              # Server entry point
│   ├── package.json              # Backend dependencies
│   └── tsconfig.json             # TypeScript configuration
├── 📄 package.json               # Frontend dependencies
├── 📄 tailwind.config.ts         # Tailwind CSS configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 vite.config.ts             # Vite configuration
├── 📄 vercel.json                # Vercel deployment config
└── 📄 README.md                  # Project documentation
```

## 🔌 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # Get user profile
```

### Project Management

```typescript
GET    /api/projects       # Get all projects
POST   /api/projects       # Create new project
GET    /api/projects/:id   # Get project by ID
PUT    /api/projects/:id   # Update project
DELETE /api/projects/:id   # Delete project
```

### Task Management

```typescript
GET    /api/tasks          # Get all tasks
POST   /api/tasks          # Create new task
GET    /api/tasks/:id      # Get task by ID
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task
```

### Document Processing

```typescript
POST /api/documents/upload    # Upload and process document
GET  /api/documents/:id       # Get processed document
POST /api/documents/analyze   # AI analysis of document
```

## 🛠 Development

### Available Scripts

**Frontend Scripts:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

**Backend Scripts:**
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
```

### Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement feature with TypeScript
   - Write tests for new functionality
   - Update documentation

2. **Code Quality**
   - ESLint for code linting
   - Prettier for code formatting
   - TypeScript for type safety
   - Consistent component patterns

3. **Testing**
   - Unit tests for utilities
   - Component testing with React Testing Library
   - E2E testing for critical user flows
   - API testing for backend endpoints

### Environment Variables

**Frontend Environment Variables:**
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `VITE_GEMINI_API_KEY` - Google Gemini API
- `VITE_API_URL` - Backend API URL

**Backend Environment Variables:**
- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CORS_ORIGIN` - Allowed CORS origins

## 🚀 Deployment

### Vercel Deployment (Frontend)

The frontend is automatically deployed to Vercel:

**Production URL**: [https://vibeflowdev.vercel.app](https://vibeflowdev.vercel.app)

**Deployment Configuration:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Deploy backend**
   - Use services like Railway, Heroku, or DigitalOcean
   - Configure environment variables
   - Set up MongoDB connection

### Backend Deployment

1. **Prepare for deployment**
   ```bash
   cd backend
   npm run build
   ```

2. **Deploy to cloud service**
   - Configure production environment variables
   - Set up MongoDB Atlas or local MongoDB
   - Configure CORS for production domain

## 🤝 Contributing

We welcome contributions to VibeFlow AI Tasks! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/vibe-flow-ai-tasks.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes and shadcn/ui components
- **Types**: Maintain strict TypeScript typing
- **Documentation**: Update documentation for new features

### Areas for Contribution

- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🧪 Test coverage expansion
- 🎨 UI/UX improvements
- 🔧 Performance optimizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lovable.dev** - Initial project scaffolding and development platform
- **Clerk** - Authentication and user management
- **Google Gemini** - AI processing capabilities
- **Vercel** - Hosting and deployment platform
- **Open Source Community** - For the amazing tools and libraries

---

<div align="center">

**Built with ❤️ by the VibeFlow Team**

[🌐 Live Demo](https://vibeflowdev.vercel.app) • [📧 Contact](mailto:contact@vibeflow.dev) • [📖 Documentation](https://vibeflowdev.vercel.app/documentation)

</div>
