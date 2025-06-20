import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import SweepLanding from '../pages/Landing'
import StudentDashboard from '../pages/StudentDashboard'
import EmployerDashboard from '../pages/EmployerDashboard'
import RoleSelection from '../pages/RoleSelection'
import CompleteStudentProfile from '../pages/CompleteStudentProfile'
import CompleteEmployerProfile from '../pages/CompleteEmployerProfile'

function AppContent() {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <SweepLanding />
              </PublicRoute>
            } 
          />          <Route 
            path="/role-selection" 
            element={<RoleSelection />} 
          />
          <Route 
            path="/complete-student-profile" 
            element={
              <ProtectedRoute requiredRole={0}>
                <CompleteStudentProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/complete-employer-profile" 
            element={
              <ProtectedRoute requiredRole={1}>
                <CompleteEmployerProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute requiredRole={0}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer-dashboard" 
            element={
              <ProtectedRoute requiredRole={1}>
                <EmployerDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    )
}

export default AppContent;