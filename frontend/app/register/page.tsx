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
import { Eye, EyeOff, BookOpen, RefreshCw, Wifi, WifiOff } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationError, setValidationError] = useState("")
  const { register, isLoading, error, clearError, user, connectionStatus, retryConnection } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    // Clear errors when inputs change
    if (error) {
      clearError()
    }
    setValidationError("")
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setValidationError("Username is required")
      return false
    }
    if (formData.username.length < 3) {
      setValidationError("Username must be at least 3 characters long")
      return false
    }
    if (!formData.email.trim()) {
      setValidationError("Email is required")
      return false
    }
    if (!formData.email.includes("@")) {
      setValidationError("Please enter a valid email address")
      return false
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      })
    } catch (err) {
      // Error is handled in the auth context
      console.error("Registration error:", err)
    }
  }

  const handleRetryConnection = async () => {
    await retryConnection()
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex">
      {/* Left side - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Join our learning community and start your educational journey</CardDescription>

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
              {connectionStatus === "disconnected" && (
                <div className="flex items-center text-sm text-red-600">
                  <WifiOff className="w-4 h-4 mr-2" />
                  Server unavailable
                  <Button variant="ghost" size="sm" onClick={handleRetryConnection} className="ml-2 h-6 px-2">
                    Retry
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {(error || validationError) && (
                <Alert variant="destructive">
                  <AlertDescription>{error || validationError}</AlertDescription>
                </Alert>
              )}

              {connectionStatus === "disconnected" && (
                <Alert>
                  <AlertDescription>
                    The server is currently unavailable. Please check your internet connection or try again later.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isLoading || connectionStatus === "disconnected"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isLoading || connectionStatus === "disconnected"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading || connectionStatus === "disconnected"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading || connectionStatus === "disconnected"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading || connectionStatus === "disconnected"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || connectionStatus === "disconnected"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading || connectionStatus === "disconnected"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading || connectionStatus === "disconnected"}
                  >
                    {showConfirmPassword ? (
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
                disabled={isLoading || connectionStatus === "disconnected"}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-600 hover:text-teal-500 font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right side - Hero Content */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 bg-gradient-to-br from-teal-600 to-blue-600">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-6">Start Your Learning Adventure</h1>
          <p className="text-xl mb-8 text-teal-100">
            Join thousands of learners who are advancing their skills and achieving their goals through our platform.
          </p>

          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">What you'll get:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Access to premium courses and content
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Personalized learning dashboard
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Progress tracking and analytics
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Community discussions and support
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Certificates upon completion
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
