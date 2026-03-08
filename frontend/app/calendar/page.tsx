"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, ArrowLeft, Plus, Clock } from "lucide-react"
import { getCalendar } from "@/lib/api-service"
import Link from "next/link"

interface CalendarEvent {
  id: string
  title: string
  description?: string
  start_date?: string
  end_date?: string
  created_at?: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getCalendar()
        setEvents(Array.isArray(data) ? data : [])
      } catch (error: any) {
        console.error("Error fetching calendar:", error)
        setError("Failed to load calendar events. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendar()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .filter((event) => event.start_date && new Date(event.start_date) >= now)
      .sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime())
      .slice(0, 5)
  }

  const getTodayEvents = () => {
    const today = new Date()
    const todayStr = today.toDateString()
    return events.filter((event) => event.start_date && new Date(event.start_date).toDateString() === todayStr)
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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Calendar</h1>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
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
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Today's Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getTodayEvents().length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No events today</p>
                  ) : (
                    <div className="space-y-3">
                      {getTodayEvents().map((event) => (
                        <div key={event.id} className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                          <h4 className="font-medium text-teal-900">{event.title}</h4>
                          {event.start_date && (
                            <p className="text-sm text-teal-700 flex items-center mt-1">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatTime(event.start_date)}
                              {event.end_date && ` - ${formatTime(event.end_date)}`}
                            </p>
                          )}
                          {event.description && <p className="text-sm text-teal-600 mt-1">{event.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {getUpcomingEvents().length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">No upcoming events</h3>
                      <p className="text-gray-500 mt-2">Create your first event to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getUpcomingEvents().map((event) => (
                        <div key={event.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                            <CalendarIcon className="w-6 h-6 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{event.title}</h4>
                            {event.description && <p className="text-gray-600 mt-1">{event.description}</p>}
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                              {event.start_date && (
                                <span className="flex items-center">
                                  <CalendarIcon className="mr-1 h-3 w-3" />
                                  {formatDate(event.start_date)}
                                </span>
                              )}
                              {event.start_date && (
                                <span className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatTime(event.start_date)}
                                  {event.end_date && ` - ${formatTime(event.end_date)}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* All Events */}
          {!isLoading && events.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        {event.start_date && (
                          <p className="text-sm text-gray-500">
                            {formatDate(event.start_date)} at {formatTime(event.start_date)}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
