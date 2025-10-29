"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-utils'

interface AuthGuardProps {
  children: React.ReactNode
}

const protectedRoutes = ['/chat', '/explore', '/profile']

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
      )

      if (isProtectedRoute) {
        const authenticated = isAuthenticated()
        
        if (!authenticated) {
          const authUrl = `/auth?redirect=${encodeURIComponent(pathname)}`
          router.push(authUrl)
          setIsAuthorized(false)
        } else {
          setIsAuthorized(true)
        }
      } else {

        setIsAuthorized(true)
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null 
  }

  return <>{children}</>
}
