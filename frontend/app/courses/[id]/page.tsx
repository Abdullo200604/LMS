"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, BookOpen, FileCheck2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
}

interface Course {
  id: string
  title: string
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  category: string
  instructor: string
  lessons: Lesson[]
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // In a real implementation, you would fetch this data from your API
        // const courseData = await getCourseById(id as string);
        // setCourse(courseData);

        // Placeholder data
        setCourse({
          id: id as string,
          title: id === "1" ? "Mobile App Development" : "Game Development",
          description:
            "Learn to build native mobile applications for iOS and Android platforms. This comprehensive course covers everything from UI design to backend integration.",
          progress: id === "1" ? 40 : 20,
          totalLessons: id === "1" ? 10 : 20,
          completedLessons: 4,
          category: "Development",
          instructor: "John Doe",
          lessons: [
            {
              id: "l1",
              title: "Introduction to Mobile Development",
              duration: "45 min",
              isCompleted: true,
            },
            {
              id: "l2",
              title: "Setting Up Your Development Environment",
              duration: "1 hr",
              isCompleted: true,
            },
            {
              id: "l3",
              title: "UI Components and Layouts",
              duration: "1.5 hr",
              isCompleted: true,
            },
            {
              id: "l4",
              title: "Working with Data and APIs",
              duration: "2 hr",
              isCompleted: true,
            },
            {
              id: "l5",
              title: "User Authentication",
              duration: "1.5 hr",
              isCompleted: false,
            },
            {
              id: "l6",
              title: "Data Persistence and Storage",
              duration: "1 hr",
              isCompleted: false,
            },
            {
              id: "l7",
              title: "Push Notifications",
              duration: "45 min",
              isCompleted: false,
            },
            {
              id: "l8",
              title: "App Performance Optimization",
              duration: "1.5 hr",
              isCompleted: false,
            },
            {
              id: "l9",
              title: "Publishing Your App",
              duration: "1 hr",
              isCompleted: false,
            },
            {
              id: "l10",
              title: "Final Project",
              duration: "3 hr",
              isCompleted: false,
            },
          ],
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching course:", error)
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCourse()
    }
  }, [id])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!course) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">Course not found</h2>
            <Link href="/courses">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
              </Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/courses" className="inline-flex items-center text-teal-600 hover:text-teal-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-500 mb-4">{course.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="mr-2 h-4 w-4" />
                {course.totalLessons} Lessons
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="mr-2 h-4 w-4" />
                Instructor: {course.instructor}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FileCheck2 className="mr-2 h-4 w-4" />
                {course.completedLessons} Completed
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          </div>

          <Tabs defaultValue="lessons">
            <TabsList className="mb-6">
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons">
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <Card key={lesson.id}>
                    <CardContent className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                      </div>
                      {lesson.isCompleted ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                      ) : (
                        <Button size="sm">Start</Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="assignments">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Course Assignments</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Midterm Project</h4>
                          <p className="text-sm text-gray-500">Due: 2 weeks from now</p>
                        </div>
                        <Button size="sm">View</Button>
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Final Project</h4>
                          <p className="text-sm text-gray-500">Due: End of course</p>
                        </div>
                        <Button size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussion">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Course Discussion</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Jane Smith</h4>
                            <span className="text-xs text-gray-500">2 days ago</span>
                          </div>
                          <p className="text-sm mt-1">
                            Has anyone completed the assignment for lesson 5? I'm having trouble with the API
                            integration part.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Mike Johnson</h4>
                            <span className="text-xs text-gray-500">1 day ago</span>
                          </div>
                          <p className="text-sm mt-1">
                            @Jane I had the same issue. Check out the documentation link the instructor posted in the
                            resources section.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <textarea
                          className="w-full p-2 border rounded-md"
                          rows={3}
                          placeholder="Write a comment..."
                        ></textarea>
                        <Button className="mt-2">Post Comment</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
