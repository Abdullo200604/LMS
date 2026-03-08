"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  category: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In a real implementation, you would fetch this data from your API
        // const coursesData = await getCourses();
        // setCourses(coursesData);

        // Placeholder data
        setCourses([
          {
            id: "1",
            title: "Mobile App Development",
            description: "Learn to build native mobile applications for iOS and Android",
            progress: 40,
            totalLessons: 10,
            completedLessons: 4,
            category: "Development",
          },
          {
            id: "2",
            title: "Game Development",
            description: "Create interactive games using modern game engines",
            progress: 20,
            totalLessons: 20,
            completedLessons: 4,
            category: "Development",
          },
          {
            id: "3",
            title: "UI/UX Design Fundamentals",
            description: "Master the principles of user interface and experience design",
            progress: 60,
            totalLessons: 15,
            completedLessons: 9,
            category: "Design",
          },
          {
            id: "4",
            title: "Web Development",
            description: "Build modern, responsive websites with HTML, CSS, and JavaScript",
            progress: 30,
            totalLessons: 25,
            completedLessons: 7,
            category: "Development",
          },
          {
            id: "5",
            title: "Cloud Computing Essentials",
            description: "Learn the fundamentals of cloud infrastructure and services",
            progress: 10,
            totalLessons: 12,
            completedLessons: 1,
            category: "IT",
          },
        ])

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">My Courses</h1>
            <div className="w-full md:w-64">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700">No courses found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">{course.category}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="mb-2">
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {course.completedLessons}/{course.totalLessons} Lessons
                      </span>
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          Continue
                        </Button>
                      </Link>
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
