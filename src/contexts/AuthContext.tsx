import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { auth } from '../config/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; message: string }>
  signInWithGoogle: () => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  createUserProfile: (displayName: string) => Promise<{ success: boolean; message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const functions = getFunctions(auth.app, 'europe-west2')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true, message: 'Signed in successfully' }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      await createUserProfile(displayName)
      return { success: true, message: 'Account created successfully' }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const createUserProfile = async (displayName: string) => {
    try {
      const createUser = httpsCallable(functions, 'createUser')
      const result = await createUser({ displayName })
      return result.data as { success: boolean; message: string }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      return { success: true, message: 'Signed in with Google' }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    createUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
