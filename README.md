# EMR Frontend

A modern, responsive Electronic Medical Records (EMR) system frontend built with Next.js, TypeScript, and Tailwind CSS. Features a comprehensive dashboard for managing patients, appointments, medical records, and more.

## 🏗️ Architecture

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Context
- **Authentication**: JWT-based with context
- **HTTP Client**: Fetch API with custom service layer

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Backend API running (see Backend README)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd EMR/frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=EMR System
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000 (make sure backend is running)

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── components/    # Shared components
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── ClientRoot.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── PatientModal.tsx
│   │   │   ├── PatientTable.tsx
│   │   │   ├── RequireAuth.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── TopNavigation.tsx
│   │   ├── context/       # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   ├── login/         # Login page
│   │   │   └── page.tsx
│   │   ├── page.tsx       # Dashboard home
│   │   ├── patients/      # Patient pages
│   │   │   ├── page.tsx
│   │   │   └── add/
│   │   │       └── page.tsx
│   │   ├── services/      # API services
│   │   │   └── api.ts
│   │   ├── signup/        # Signup page
│   │   │   └── page.tsx
│   │   └── utils/         # Utility functions
│   │       └── auth.ts
│   ├── components/        # Reusable UI components
│   │   └── ui/
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── table.tsx
│   └── lib/               # Library utilities
│       └── utils.ts
├── components.json        # shadcn/ui configuration
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 UI Components

The application uses shadcn/ui components built on top of Radix UI primitives:

### Core Components
- **Button**: Various button styles and states
- **Input**: Form input fields with validation
- **Select**: Dropdown selection components
- **Card**: Content containers with headers
- **Table**: Data tables with sorting and pagination
- **Badge**: Status indicators and labels

### Custom Components
- **DashboardLayout**: Main application layout with sidebar
- **TopNavigation**: Header with user menu and notifications
- **PatientTable**: Patient data display with actions
- **PatientModal**: Patient creation/editing modal
- **FormField**: Reusable form field wrapper
- **StatCard**: Dashboard statistics cards

## 🔐 Authentication

The application implements JWT-based authentication with the following features:

### Authentication Flow
1. **Login**: User enters credentials
2. **Token Storage**: JWT stored in localStorage
3. **Context Management**: Auth state managed via React Context
4. **Route Protection**: Protected routes require authentication
5. **Auto-logout**: Token expiration handling

### Protected Routes
- Dashboard (`/`)
- Patients (`/patients`)
- Add Patient (`/patients/add`)
- All other authenticated pages

### Public Routes
- Login (`/login`)
- Signup (`/signup`)

## 📊 Features

### Dashboard
- **Overview Statistics**: Patient count, appointments, revenue
- **Recent Activity**: Latest patient registrations and appointments
- **Quick Actions**: Add patient, schedule appointment
- **Navigation**: Collapsible sidebar with dropdown menus

### Patient Management
- **Patient List**: View all patients with search and filtering
- **Add Patient**: Comprehensive patient registration form
- **Patient Details**: View and edit patient information
- **Medical Records**: Access patient medical history

### Forms
- **Patient Registration**: Multi-section form with validation
- **Electronic Intake**: Medical history questionnaire
- **Appointment Booking**: Schedule appointments
- **Lead Capture**: Contact form for potential patients

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# shadcn/ui
npx shadcn@latest add [component]  # Add new UI component
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting (configured via ESLint)
- **Tailwind CSS**: Utility-first CSS framework

### Component Development
When creating new components:

1. **Use TypeScript**: All components should be typed
2. **Follow shadcn/ui patterns**: Use existing component structure
3. **Responsive Design**: Ensure mobile compatibility
4. **Accessibility**: Include proper ARIA labels and keyboard navigation

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v3 with custom configuration:
- Custom color palette
- Extended spacing and typography
- Component-specific utilities

### shadcn/ui
Components are configured via `components.json`:
- TypeScript support
- Tailwind CSS integration
- Custom component paths

### API Configuration
API endpoints are configured in `src/app/services/api.ts`:
- Base URL configuration
- Request/response interceptors
- Error handling
- Authentication headers

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
For production, set these environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_NAME=EMR System
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment option
- **Docker**: Containerized deployment

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `npm install`
   - Check TypeScript errors: `npm run type-check`

2. **API Connection Issues**
   - Verify backend is running on correct port
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Ensure CORS is configured on backend

3. **Styling Issues**
   - Clear browser cache
   - Restart development server
   - Check Tailwind CSS configuration

4. **Authentication Issues**
   - Clear localStorage
   - Check JWT token expiration
   - Verify backend authentication endpoints

### Development Tips

1. **Hot Reload**: Changes are automatically reflected in development
2. **TypeScript**: Use strict mode for better type safety
3. **Component Library**: Leverage shadcn/ui for consistent UI
4. **Responsive Design**: Test on multiple screen sizes

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach**: Designed for mobile devices first
- **Breakpoints**: Tailwind CSS responsive breakpoints
- **Touch-friendly**: Optimized for touch interactions
- **Progressive enhancement**: Works on all device types

## 🔒 Security

### Frontend Security Measures
- **Input Validation**: Client-side form validation
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection
- **Secure Storage**: JWT tokens stored securely

### Best Practices
- Never store sensitive data in localStorage
- Validate all user inputs
- Use HTTPS in production
- Implement proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure code passes linting
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the backend API documentation
- Open an issue on GitHub
- Contact the development team