# 🎓 MentorLink

<div align="center">

**A Modern Platform Connecting Students with Mentors**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

[Features](#-features) • [Installation](#-installation) • [Docker](#-docker-deployment) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

**MentorLink** is a comprehensive mentorship platform designed to bridge the gap between students seeking guidance and experienced professionals willing to share their knowledge. The platform facilitates meaningful connections through an intuitive interface, real-time messaging, event management, and session scheduling.

### 🎯 Key Objectives

- **Connect** students with industry mentors based on skills and interests
- **Facilitate** real-time communication through integrated messaging
- **Organize** events and workshops for community learning
- **Track** mentorship sessions and progress
- **Build** a supportive learning community

---

## ✨ Features

### 👥 User Management
- **Multi-role System**: Students, Mentors, Event Organizers, and Admins
- **Profile Management**: Comprehensive profiles with skills, interests, and social links
- **Email Verification**: OTP-based email verification for secure registration
- **Soft Delete**: Account recovery within 30 days by admin

### 💬 Real-time Communication
- **Instant Messaging**: Socket.IO powered real-time chat
- **Conversation History**: Persistent message storage
- **Online Status**: See who's currently online
- **Typing Indicators**: Know when someone is typing

### 📅 Session Management
- **Schedule Sessions**: Book mentorship sessions with calendar integration
- **Session History**: Track past and upcoming sessions
- **Zoom Integration**: Connect meeting links directly

### 🎪 Events
- **Event Discovery**: Browse local and global events
- **Category Filtering**: Filter by Workshops, Seminars, Hackathons, etc.
- **Event Hosting**: Organizers can create and manage events
- **Registration**: Easy event registration system

### 🔔 Notifications
- **Real-time Alerts**: Connection requests, messages, session reminders
- **Smart Notifications**: Prioritized and categorized alerts

### 🛡️ Admin Dashboard
- **User Management**: View, manage, and moderate users
- **Analytics**: Platform statistics and insights
- **Audit Logs**: Track all admin actions
- **Account Recovery**: Restore soft-deleted accounts

### 🌓 Theme Support
- **Dark Mode**: Full dark theme support across all pages
- **Smooth Transitions**: Elegant theme switching

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **React Router 7** | Client-side Routing |
| **Socket.IO Client** | Real-time Communication |
| **Axios** | HTTP Client |
| **React Icons** | Icon Library |
| **Material UI** | UI Components |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **Socket.IO** | WebSocket Server |
| **JWT** | Authentication |
| **Cloudinary** | Image Storage |
| **Nodemailer** | Email Service |

### DevOps
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container Orchestration |
| **Nginx** | Reverse Proxy |

---

## 📁 Project Structure

```
mentorlink/
├── 📂 backend/                 # Node.js Express API
│   ├── 📂 config/              # Database & Cloudinary config
│   ├── 📂 controllers/         # Route handlers
│   ├── 📂 middleware/          # Auth, upload middleware
│   ├── 📂 models/              # Mongoose schemas
│   ├── 📂 routes/              # API routes
│   ├── 📂 utils/               # Utility functions
│   ├── 📄 server.js            # Entry point
│   └── 📄 Dockerfile           # Backend container
│
├── 📂 src/                     # React Frontend
│   ├── 📂 components/          # Reusable components
│   │   ├── 📂 admin/           # Admin components
│   │   ├── 📂 chat/            # Chat components
│   │   ├── 📂 common/          # Shared components
│   │   ├── 📂 events/          # Event components
│   │   ├── 📂 home/            # Home page components
│   │   └── 📂 landing/         # Landing page components
│   ├── 📂 contexts/            # React contexts
│   ├── 📂 pages/               # Page components
│   ├── 📂 services/            # API services
│   ├── 📂 styles/              # Global styles
│   └── 📄 App.jsx              # Main App component
│
├── 📄 docker-compose.yml       # Docker orchestration
├── 📄 Dockerfile               # Frontend container
├── 📄 nginx.conf               # Nginx configuration
└── 📄 package.json             # Frontend dependencies
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6.0+ ([Download](https://mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/))

### Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/TEAM-3-RCTS-INTERNS/MENTORLINK_NEW.git
cd MENTORLINK_NEW
```

#### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentorlink
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL
CLIENT_URL=http://localhost:5173
```

#### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your values
notepad .env  # Windows
nano .env     # Mac/Linux

# 3. Build and start containers
docker-compose up --build -d

# 4. Access the application
# Frontend: http://localhost
# Backend:  http://localhost:5000
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build -d
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| POST | `/api/users/verify-otp` | Verify email OTP |
| GET | `/api/users/profile` | Get user profile |

### Mentors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mentors` | Get all mentors |
| GET | `/api/mentors/:id` | Get mentor by ID |
| POST | `/api/mentors` | Create mentor profile |
| PUT | `/api/mentors/:id` | Update mentor profile |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create student profile |
| PUT | `/api/students/:id` | Update student profile |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | Get user conversations |
| GET | `/api/messages/:recipientId` | Get messages with user |
| POST | `/api/messages` | Send message |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get user sessions |
| POST | `/api/sessions` | Schedule session |
| PUT | `/api/sessions/:id` | Update session |

### Connections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/connect` | Get user connections |
| POST | `/api/connect/request` | Send connection request |
| PUT | `/api/connect/accept/:id` | Accept connection |
| PUT | `/api/connect/reject/:id` | Reject connection |

---

## 🔐 Environment Variables

### Root `.env` (for Docker)
```env
# Docker Compose Configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
CLIENT_URL=http://localhost
```

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentorlink
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
CLIENT_URL=http://localhost:5173
```

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Browse mentors, request connections, attend events, message mentors |
| **Mentor** | Accept students, schedule sessions, share expertise |
| **Organizer** | Create and manage events, track registrations |
| **Admin** | Full platform management, user moderation, analytics |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style
- Use meaningful variable/function names
- Add comments for complex logic
- Follow existing code patterns
- Test your changes thoroughly

---

## 📄 License

This project is developed by **TEAM-3 RCTS INTERNS**.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Node.js](https://nodejs.org/) - Backend Runtime
- [MongoDB](https://mongodb.com/) - Database
- [Socket.IO](https://socket.io/) - Real-time Communication
- [Cloudinary](https://cloudinary.com/) - Image Management

---

<div align="center">

**Made with ❤️ by TEAM-3 RCTS INTERNS**

⭐ Star this repository if you found it helpful!

</div>
