"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, BookOpen, Users, Award, TrendingUp, RefreshCw, Wifi, WifiOff } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError, user, connectionStatus, retryConnection } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    // Clear error when component mounts or when inputs change
    if (error) {
      clearError()
    }
  }, [username, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      return
    }

    try {
      await login(username.trim(), password)
    } catch (err) {
      // Error is handled in the auth context
    }
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Learning Management System account</CardDescription>
            {/* Connection Status */}
            <div className="flex items-center justify-center mt-2">
              {connectionStatus === "checking" && (
                <div className="flex items-center text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking connection...
                </div>
              )}
              {connectionStatus === "connected" && (
                <div className="flex items-center text-sm text-green-600">
                  <Wifi className="w-4 h-4 mr-2" />
                  Connected to server
                </div>
              )}
              {connectionStatus === "offline" && (
                <div className="flex items-center text-sm text-blue-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Offline mode (demo data)
                </div>
              )}
              {connectionStatus === "disconnected" && (
                <div className="flex items-center text-sm text-red-600">
                  <WifiOff className="w-4 h-4 mr-2" />
                  Server unavailable
                  <Button variant="ghost" size="sm" onClick={retryConnection} className="ml-2 h-6 px-2">
                    Retry
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {connectionStatus === "offline" && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    Running in offline mode with demo data. You can explore all features using any username and
                    password.
                  </AlertDescription>
                </Alert>
              )}
              {connectionStatus === "disconnected" && (
                <Alert>
                  <AlertDescription>
                    The server is currently unavailable. Please check your internet connection or try again later.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading || connectionStatus === "disconnected"}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading || connectionStatus === "disconnected"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isLoading || connectionStatus === "disconnected" || !username.trim() || !password.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : connectionStatus === "offline" ? (
                  "Sign In (Demo Mode)"
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-teal-600 hover:text-teal-500 font-medium">
                  Create account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right side - Hero Image and Features */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 bg-gradient-to-br from-teal-600 to-blue-600">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-6">Transform Your Learning Journey</h1>
          <p className="text-xl mb-8 text-teal-100">
            Access courses, track progress, and achieve your educational goals with our comprehensive learning platform.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Interactive Courses</h3>
                <p className="text-teal-100">Engage with multimedia content and hands-on exercises</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Progress Tracking</h3>
                <p className="text-teal-100">Monitor your learning progress and achievements</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Collaborative Learning</h3>
                <p className="text-teal-100">Connect with peers and instructors in discussions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Certifications</h3>
                <p className="text-teal-100">Earn certificates upon course completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-40 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute top-40 right-60 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>
    </div>
  )
}
