"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Search, Calendar, ArrowLeft, Plus } from "lucide-react"
import { getAssignments } from "@/lib/api-service"
import Link from "next/link"

interface Assignment {
  id: string
  title: string
  description?: string
  due_date?: string
  created_at?: string
  is_submitted?: boolean
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getAssignments()
        setAssignments(Array.isArray(data) ? data : [])
      } catch (error: any) {
        console.error("Error fetching assignments:", error)
        setError("Failed to load assignments. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.description && assignment.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-teal-600 hover:text-teal-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Assignments</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search assignments..."
                  className="pl-8 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">
                {searchTerm ? "No assignments found" : "No assignments available"}
              </h2>
              <p className="text-gray-500 mt-2">
                {searchTerm ? "Try adjusting your search criteria" : "Check back later for new assignments"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
                <Card key={assignment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          {assignment.is_submitted && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                              Submitted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assignment.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{assignment.description}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      {assignment.due_date && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </div>
                      )}
                      {assignment.created_at && (
                        <div className="text-xs text-gray-400">
                          Created: {new Date(assignment.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/assignments/${assignment.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {!assignment.is_submitted && <Button className="bg-teal-600 hover:bg-teal-700">Submit</Button>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
