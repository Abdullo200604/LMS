"use client"

import { useState, useEffect } from "react"
import { Home, BookOpen, FileText, BarChart2, Award, FileCheck2, Lock, LogOut, Calendar, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { getBooks, getAssignments, getMyGrades } from "@/lib/api-service"
import Link from "next/link"

interface Book {
  id: string
  title: string
  description?: string
  author?: string
  created_at?: string
}

interface Assignment {
  id: string
  title: string
  description?: string
  due_date?: string
  created_at?: string
}

interface Grade {
  id: string
  assignment?: Assignment
  grade?: number
  feedback?: string
}

export function LMSDashboard() {
  const { user, logout } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch data from API
        const [booksData, assignmentsData, gradesData] = await Promise.allSettled([
          getBooks(),
          getAssignments(),
          getMyGrades(),
        ])

        // Handle books data
        if (booksData.status === "fulfilled") {
          setBooks(Array.isArray(booksData.value) ? booksData.value : [])
        } else {
          console.error("Failed to fetch books:", booksData.reason)
        }

        // Handle assignments data
        if (assignmentsData.status === "fulfilled") {
          setAssignments(Array.isArray(assignmentsData.value) ? assignmentsData.value : [])
        } else {
          console.error("Failed to fetch assignments:", assignmentsData.reason)
        }

        // Handle grades data
        if (gradesData.status === "fulfilled") {
          setGrades(Array.isArray(gradesData.value) ? gradesData.value : [])
        } else {
          console.error("Failed to fetch grades:", gradesData.reason)
        }
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try refreshing the page.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const stats = {
    totalEnrolled: books.length,
    completed: grades.filter((grade) => grade.grade && grade.grade >= 70).length,
    averageGrade:
      grades.length > 0 ? Math.round(grades.reduce((sum, grade) => sum + (grade.grade || 0), 0) / grades.length) : 0,
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
            <BookOpen className="w-5 h-5 text-teal-600" />
          </div>
          <h1 className="text-lg font-semibold">LMS Portal</h1>
        </div>

        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-700 bg-gray-100 rounded-md group">
            <Home className="w-5 h-5 mr-3 text-gray-500" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            href="/courses"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md group"
          >
            <BookOpen className="w-5 h-5 mr-3 text-gray-500" />
            <span>Courses</span>
          </Link>
          <Link
            href="/assignments"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md group"
          >
            <FileText className="w-5 h-5 mr-3 text-gray-500" />
            <span>Assignments</span>
          </Link>
          <Link href="/grades" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md group">
            <BarChart2 className="w-5 h-5 mr-3 text-gray-500" />
            <span>Grades</span>
          </Link>
          <Link
            href="/calendar"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md group"
          >
            <Calendar className="w-5 h-5 mr-3 text-gray-500" />
            <span>Calendar</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md group"
          >
            <User className="w-5 h-5 mr-3 text-gray-500" />
            <span>Profile</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md group"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-500" />
            <span>Logout</span>
          </button>
        </nav>

        <div className="mt-auto pt-20">
          <div className="p-4 text-center">
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <Lock className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-700">Unlock Premium Resources & Features</h3>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-teal-100 mr-4 flex items-center justify-center">
              <User className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome Back {user?.first_name || user?.username || "User"}
              </h1>
              <p className="text-gray-500">Here's an overview of your learning progress</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Courses</p>
              <p className="text-2xl font-semibold">{stats.totalEnrolled}</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-600" />
            </div>
          </Card>

          <Card className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">Completed</p>
              <p className="text-2xl font-semibold">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-teal-600" />
            </div>
          </Card>

          <Card className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">Average Grade</p>
              <p className="text-2xl font-semibold">{stats.averageGrade}%</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-teal-600" />
            </div>
          </Card>
        </div>

        {/* Recent Books/Courses */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {books.length > 0 ? (
            books.slice(0, 4).map((book) => (
              <Card key={book.id} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{book.title}</h3>
                    {book.author && <p className="text-sm text-gray-500">by {book.author}</p>}
                  </div>
                </div>
                {book.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{book.description}</p>}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {book.created_at && new Date(book.created_at).toLocaleDateString()}
                  </span>
                  <Link href={`/courses/${book.id}`}>
                    <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">View Course</button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No courses available</h3>
              <p className="text-gray-500">Check back later for new courses</p>
            </div>
          )}
        </div>

        {/* Recent Assignments and Grades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Assignments */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Assignments</h2>
              <Link href="/assignments" className="text-teal-600 hover:text-teal-700 text-sm">
                View all
              </Link>
            </div>
            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="flex items-start">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{assignment.title}</h3>
                      {assignment.due_date && (
                        <p className="text-sm text-gray-500">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No assignments available</p>
              </div>
            )}
          </Card>

          {/* Recent Grades */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Grades</h2>
              <Link href="/grades" className="text-teal-600 hover:text-teal-700 text-sm">
                View all
              </Link>
            </div>
            {grades.length > 0 ? (
              <div className="space-y-4">
                {grades.slice(0, 3).map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <Award className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{grade.assignment?.title || "Assignment"}</h3>
                        {grade.feedback && <p className="text-sm text-gray-500 line-clamp-1">{grade.feedback}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-lg font-semibold ${
                          (grade.grade || 0) >= 70 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {grade.grade || 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No grades available</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
