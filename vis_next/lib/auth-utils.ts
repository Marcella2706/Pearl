export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('__Pearl_Token', token)
  }

  if (typeof document !== 'undefined') {

    const cookieOptions = [
      `__Pearl_Token=${token}`,
      'path=/',
      'max-age=604800',
      'samesite=strict'
    ]
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.push('secure')
    }
    
    document.cookie = cookieOptions.join('; ')
  }
}

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('__Pearl_Token')
  }
  if (typeof document !== 'undefined') {
    document.cookie = '__Pearl_Token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=strict'
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('__Pearl_Token')
  }
  return null
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
