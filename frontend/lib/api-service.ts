import { config, isDevelopment } from "./config"
import { mockUser, mockBooks, mockAssignments, mockGrades, mockCalendarEvents, mockApiResponses } from "./mock-data"

// Helper function to simulate API delay in development
const simulateDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("lms-token")

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    console.log(`Making API request to: ${config.API_BASE_URL}${endpoint}`)
    console.log("Request options:", { ...options, headers })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT)

    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      mode: "cors",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        try {
          const errorText = await response.text()
          console.error("Error response text:", errorText)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        } catch (textError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      }

      console.error("API Error:", errorData)

      const errorMessage =
        errorData?.message ||
        errorData?.detail ||
        errorData?.error ||
        (typeof errorData === "string" ? errorData : null) ||
        `HTTP ${response.status}: ${response.statusText}`

      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log("API Response:", data)
    return data
  } catch (error) {
    console.error("Fetch error:", error)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your internet connection and try again.")
      }
      if (error.message.includes("fetch")) {
        throw new Error("Unable to connect to the server. The API may be unavailable or there may be a CORS issue.")
      }
      if (error.message.includes("CORS")) {
        throw new Error("CORS error: The server needs to allow cross-origin requests.")
      }
      if (error.message.includes("NetworkError")) {
        throw new Error("Network error. Please check your internet connection.")
      }
    }

    throw error
  }
}

// Helper function to use mock data in development/offline mode
async function useMockData<T>(mockData: T, delay = 500): Promise<T> {
  await simulateDelay(delay)
  return mockData
}

// Authentication
export async function login(username: string, password: string) {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI("/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })
    } catch (error) {
      console.warn("API login failed, using mock data:", error)
      result = await useMockData(mockApiResponses.login)
    }
  } else {
    result = await fetchAPI("/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

export async function register(userData: {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}) {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI("/register/", {
        method: "POST",
        body: JSON.stringify(userData),
      })
    } catch (error) {
      console.warn("API registration failed, using mock data:", error)
      result = await useMockData({
        ...mockApiResponses.register,
        user: { ...mockUser, ...userData },
      })
    }
  } else {
    result = await fetchAPI("/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

// User Profile
export async function getUserProfile() {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI("/user/profile/")
    } catch (error) {
      console.warn("API profile fetch failed, using mock data:", error)
      result = await useMockData(mockUser)
    }
  } else {
    result = await fetchAPI("/user/profile/")
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

export async function updateUserProfile(profileData: any) {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI("/user/profile/update/v2/", {
        method: "PUT",
        body: JSON.stringify(profileData),
      })
    } catch (error) {
      console.warn("API profile update failed, using mock data:", error)
      result = await useMockData({ ...mockUser, ...profileData })
    }
  } else {
    result = await fetchAPI("/user/profile/update/v2/", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

// Books (Courses)
export async function getBooks() {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI("/books/")
    } catch (error) {
      console.warn("API books fetch failed, using mock data:", error)
      result = await useMockData(mockBooks)
    }
  } else {
    try {
      result = await fetchAPI("/books/")
    } catch (error) {
      console.error("Get books API error:", error)
      result = []
    }
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

export async function getBookById(id: string) {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI(`/books/${id}/`)
    } catch (error) {
      console.warn("API book fetch failed, using mock data:", error)
      const book = mockBooks.find((b) => b.id === id)
      result = await useMockData(book || mockBooks[0])
    }
  } else {
    result = await fetchAPI(`/books/${id}/`)
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

// Assignments
export async function getAssignments() {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI("/assignments/")
    } catch (error) {
      console.warn("API assignments fetch failed, using mock data:", error)
      result = await useMockData(mockAssignments)
    }
  } else {
    try {
      result = await fetchAPI("/assignments/")
    } catch (error) {
      console.error("Get assignments API error:", error)
      result = []
    }
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

export async function getAssignmentById(id: string) {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI(`/assignments/${id}/`)
    } catch (error) {
      console.warn("API assignment fetch failed, using mock data:", error)
      const assignment = mockAssignments.find((a) => a.id === id)
      result = await useMockData(assignment || mockAssignments[0])
    }
  } else {
    result = await fetchAPI(`/assignments/${id}/`)
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

// Grades
export async function getMyGrades() {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI("/grades/my/")
    } catch (error) {
      console.warn("API grades fetch failed, using mock data:", error)
      result = await useMockData(mockGrades)
    }
  } else {
    try {
      result = await fetchAPI("/grades/my/")
    } catch (error) {
      console.error("Get grades API error:", error)
      result = []
    }
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

// Calendar
export async function getCalendar() {
  let result
  if (config.DEVELOPMENT_MODE || config.ENABLE_OFFLINE_MODE) {
    try {
      result = await fetchAPI("/calendar/")
    } catch (error) {
      console.warn("API calendar fetch failed, using mock data:", error)
      result = await useMockData(mockCalendarEvents)
    }
  } else {
    try {
      result = await fetchAPI("/calendar/")
    } catch (error) {
      console.error("Get calendar API error:", error)
      result = []
    }
  }

  if (isDevelopment) {
    console.log("Using mock data:", result)
  }
  return result
}

// Test connection function with better error handling
export async function testConnection() {
  try {
    console.log("Testing connection to:", config.API_BASE_URL)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout for connection test

    const response = await fetch(`${config.API_BASE_URL}/api/schema/`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("Connection test response:", response.status, response.statusText)

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
    }
  } catch (error) {
    console.error("Connection test failed:", error)

    let errorMessage = "Unknown error"
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Connection timeout"
      } else if (error.message.includes("fetch")) {
        errorMessage = "Network error or CORS issue"
      } else {
        errorMessage = error.message
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

// Additional helper functions for development
export async function createBook(bookData: any) {
  if (config.DEVELOPMENT_MODE) {
    return await useMockData({ id: Date.now().toString(), ...bookData })
  }
  return fetchAPI("/books/create/", {
    method: "POST",
    body: JSON.stringify(bookData),
  })
}

export async function createAssignment(assignmentData: any) {
  if (config.DEVELOPMENT_MODE) {
    return await useMockData({ id: Date.now().toString(), ...assignmentData })
  }
  return fetchAPI("/assignments/create/", {
    method: "POST",
    body: JSON.stringify(assignmentData),
  })
}

export async function createCalendarEvent(eventData: any) {
  if (config.DEVELOPMENT_MODE) {
    return await useMockData({ id: Date.now().toString(), ...eventData })
  }
  return fetchAPI("/calendar/create/", {
    method: "POST",
    body: JSON.stringify(eventData),
  })
}
