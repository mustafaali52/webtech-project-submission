import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function ProtectedRoute({ children, requiredRole }) {
    const { user, isAuthenticated, loading } = useAuth()
    const location = useLocation()
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/" replace />
    }
    
    if (requiredRole && user?.role !== requiredRole) {
      const correctPath = user?.role === 0 ? '/student-dashboard' : '/employer-dashboard'
      return <Navigate to={correctPath} replace />
    }

    // Check if user needs to complete profile (but allow access to profile completion pages)
    const isProfileCompletionPage = location.pathname === '/complete-student-profile' || 
                                   location.pathname === '/complete-employer-profile'
    
    if (!user?.hasCompletedProfile && !isProfileCompletionPage) {
      const profilePath = user?.role === 0 ? '/complete-student-profile' : '/complete-employer-profile'
      return <Navigate to={profilePath} replace />
    }
    
    return children
}

export default ProtectedRoute;
