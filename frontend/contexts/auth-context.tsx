"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, getUserProfile, testConnection } from "@/lib/api-service"
import { config } from "@/lib/config"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  connectionStatus: "checking" | "connected" | "disconnected" | "offline"
  isOfflineMode: boolean
  login: (username: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  clearError: () => void
  retryConnection: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected" | "offline">(
    "checking",
  )
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const router = useRouter()

  const checkConnection = async () => {
    try {
      setConnectionStatus("checking")
      const result = await testConnection()

      if (result.success) {
        setConnectionStatus("connected")
        setIsOfflineMode(false)
        return true
      } else {
        console.warn("Connection failed:", result.error)
        if (config.ENABLE_OFFLINE_MODE || config.DEVELOPMENT_MODE) {
          setConnectionStatus("offline")
          setIsOfflineMode(true)
          return false
        } else {
          setConnectionStatus("disconnected")
          setIsOfflineMode(false)
          return false
        }
      }
    } catch (error) {
      console.error("Connection check failed:", error)
      if (config.ENABLE_OFFLINE_MODE || config.DEVELOPMENT_MODE) {
        setConnectionStatus("offline")
        setIsOfflineMode(true)
        return false
      } else {
        setConnectionStatus("disconnected")
        setIsOfflineMode(false)
        return false
      }
    }
  }

  const retryConnection = async () => {
    await checkConnection()
  }

  useEffect(() => {
    // Check connection and authentication on mount
    const initializeAuth = async () => {
      try {
        // Check connection status
        const isConnected = await checkConnection()

        // Check if user is logged in
        const token = localStorage.getItem("lms-token")
        if (token) {
          try {
            const userData = await getUserProfile()
            setUser(userData)
          } catch (error) {
            console.error("Failed to fetch user profile:", error)
            // Don't remove token in offline mode, user might be valid
            if (!isOfflineMode) {
              localStorage.removeItem("lms-token")
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting login with:", { username, isOfflineMode, developmentMode: config.DEVELOPMENT_MODE })

      const response = await apiLogin(username, password)
      console.log("Login response:", response)

      // Handle different possible response formats
      const token = response.token || response.access_token || response.access || response.key
      if (token) {
        localStorage.setItem("lms-token", token)
      }

      // Try to get user profile
      try {
        const userData = await getUserProfile()
        setUser(userData)
      } catch (profileError) {
        console.warn("Profile fetch failed, using login response data")
        // If profile fetch fails, create user object from login response
        setUser({
          id: response.user?.id || response.id || Date.now().toString(),
          username: response.user?.username || response.username || username,
          email: response.user?.email || response.email || `${username}@example.com`,
          first_name: response.user?.first_name || response.first_name || "",
          last_name: response.user?.last_name || response.last_name || "",
        })
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login failed:", error)
      let errorMessage = "Login failed. Please check your credentials and try again."

      if (isOfflineMode || config.DEVELOPMENT_MODE) {
        errorMessage = "Login successful (offline mode)"
        // In offline mode, accept any credentials for demo purposes
        setUser({
          id: "demo-user",
          username: username,
          email: `${username}@example.com`,
          first_name: "Demo",
          last_name: "User",
        })
        localStorage.setItem("lms-token", "demo-token")
        router.push("/dashboard")
        return
      }

      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting registration with:", {
        userData,
        isOfflineMode,
        developmentMode: config.DEVELOPMENT_MODE,
      })

      const response = await apiRegister(userData)
      console.log("Registration response:", response)

      // Handle different possible response formats
      const token = response.token || response.access_token || response.access || response.key
      if (token) {
        localStorage.setItem("lms-token", token)
      }

      // Try to get user profile
      try {
        const userProfile = await getUserProfile()
        setUser(userProfile)
      } catch (profileError) {
        console.warn("Profile fetch failed, using registration response data")
        // If profile fetch fails, create user object from register response
        setUser({
          id: response.user?.id || response.id || Date.now().toString(),
          username: response.user?.username || response.username || userData.username,
          email: response.user?.email || response.email || userData.email,
          first_name: response.user?.first_name || response.first_name || userData.first_name || "",
          last_name: response.user?.last_name || response.last_name || userData.last_name || "",
        })
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration failed:", error)
      let errorMessage = "Registration failed. Please try again."

      if (isOfflineMode || config.DEVELOPMENT_MODE) {
        errorMessage = "Registration successful (offline mode)"
        // In offline mode, accept registration for demo purposes
        setUser({
          id: "demo-user",
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
        })
        localStorage.setItem("lms-token", "demo-token")
        router.push("/dashboard")
        return
      }

      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("lms-token")
    setUser(null)
    setError(null)
    router.push("/login")
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        connectionStatus,
        isOfflineMode,
        login,
        register,
        logout,
        clearError,
        retryConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
