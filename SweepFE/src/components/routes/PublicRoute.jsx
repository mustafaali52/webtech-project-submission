import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function PublicRoute({ children }) {
    const { user, isAuthenticated, loading } = useAuth()
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }
    
    if (isAuthenticated && user) {
  
      const dashboardPath = user.role === 0 ? '/student-dashboard' : '/employer-dashboard'
      return <Navigate to={dashboardPath} replace />
    }
    
    return children
}

export default PublicRoute;