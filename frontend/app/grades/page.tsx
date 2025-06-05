"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Award, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import { getMyGrades } from "@/lib/api-service"
import Link from "next/link"

interface Grade {
  id: string
  assignment?: {
    id: string
    title: string
    due_date?: string
  }
  grade?: number
  feedback?: string
  graded_at?: string
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getMyGrades()
        setGrades(Array.isArray(data) ? data : [])
      } catch (error: any) {
        console.error("Error fetching grades:", error)
        setError("Failed to load grades. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrades()
  }, [])

  const calculateStats = () => {
    if (grades.length === 0) return { average: 0, highest: 0, lowest: 0, total: 0 }

    const validGrades = grades.filter((g) => g.grade !== undefined && g.grade !== null).map((g) => g.grade!)

    if (validGrades.length === 0) return { average: 0, highest: 0, lowest: 0, total: 0 }

    const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length
    const highest = Math.max(...validGrades)
    const lowest = Math.min(...validGrades)

    return {
      average: Math.round(average * 10) / 10,
      highest,
      lowest,
      total: validGrades.length,
    }
  }

  const stats = calculateStats()

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600"
    if (grade >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeBgColor = (grade: number) => {
    if (grade >= 90) return "bg-green-50 border-green-200"
    if (grade >= 80) return "bg-blue-50 border-blue-200"
    if (grade >= 70) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-teal-600 hover:text-teal-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-8">My Grades</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Average Grade</p>
                      <p className={`text-2xl font-semibold ${getGradeColor(stats.average)}`}>{stats.average}%</p>
                    </div>
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Highest Grade</p>
                      <p className={`text-2xl font-semibold ${getGradeColor(stats.highest)}`}>{stats.highest}%</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Lowest Grade</p>
                      <p className={`text-2xl font-semibold ${getGradeColor(stats.lowest)}`}>{stats.lowest}%</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Total Graded</p>
                      <p className="text-2xl font-semibold">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Grades List */}
              {grades.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700">No grades available</h2>
                  <p className="text-gray-500 mt-2">Complete assignments to see your grades here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {grades.map((grade) => (
                    <Card
                      key={grade.id}
                      className={`border-l-4 ${grade.grade ? getGradeBgColor(grade.grade) : "bg-gray-50 border-gray-200"}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{grade.assignment?.title || "Assignment"}</h3>

                            {grade.feedback && <p className="text-gray-600 mb-3">{grade.feedback}</p>}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              {grade.assignment?.due_date && (
                                <span>Due: {new Date(grade.assignment.due_date).toLocaleDateString()}</span>
                              )}
                              {grade.graded_at && <span>Graded: {new Date(grade.graded_at).toLocaleDateString()}</span>}
                            </div>
                          </div>

                          <div className="text-right">
                            {grade.grade !== undefined && grade.grade !== null ? (
                              <div className="text-center">
                                <div className={`text-3xl font-bold ${getGradeColor(grade.grade)}`}>{grade.grade}%</div>
                                <div className="text-sm text-gray-500">
                                  {grade.grade >= 90
                                    ? "Excellent"
                                    : grade.grade >= 80
                                      ? "Good"
                                      : grade.grade >= 70
                                        ? "Satisfactory"
                                        : "Needs Improvement"}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-400">-</div>
                                <div className="text-sm text-gray-500">Not graded</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
