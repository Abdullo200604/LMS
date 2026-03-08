// Mock data for development and offline mode

export const mockUser = {
  id: "1",
  username: "demo_user",
  email: "demo@example.com",
  first_name: "Demo",
  last_name: "User",
}

export const mockBooks = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript",
    author: "John Smith",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Advanced React Concepts",
    description: "Master advanced React patterns and best practices",
    author: "Jane Doe",
    created_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    title: "Database Design Principles",
    description: "Learn how to design efficient and scalable databases",
    author: "Mike Johnson",
    created_at: "2024-01-25T09:15:00Z",
  },
]

export const mockAssignments = [
  {
    id: "1",
    title: "Build a Portfolio Website",
    description: "Create a personal portfolio website using HTML, CSS, and JavaScript",
    due_date: "2024-02-15T23:59:59Z",
    created_at: "2024-01-30T10:00:00Z",
    is_submitted: false,
  },
  {
    id: "2",
    title: "React Component Library",
    description: "Develop a reusable component library with React and TypeScript",
    due_date: "2024-02-20T23:59:59Z",
    created_at: "2024-02-01T11:00:00Z",
    is_submitted: true,
  },
  {
    id: "3",
    title: "Database Schema Design",
    description: "Design a database schema for an e-commerce application",
    due_date: "2024-02-25T23:59:59Z",
    created_at: "2024-02-05T15:30:00Z",
    is_submitted: false,
  },
]

export const mockGrades = [
  {
    id: "1",
    assignment: {
      id: "2",
      title: "React Component Library",
      due_date: "2024-02-20T23:59:59Z",
    },
    grade: 92,
    feedback: "Excellent work! Your components are well-structured and documented.",
    graded_at: "2024-02-21T10:00:00Z",
  },
  {
    id: "2",
    assignment: {
      id: "1",
      title: "Build a Portfolio Website",
      due_date: "2024-02-15T23:59:59Z",
    },
    grade: 88,
    feedback: "Good job! Consider improving the responsive design.",
    graded_at: "2024-02-16T14:30:00Z",
  },
]

export const mockCalendarEvents = [
  {
    id: "1",
    title: "Web Development Workshop",
    description: "Hands-on workshop covering modern web development techniques",
    start_date: "2024-02-10T14:00:00Z",
    end_date: "2024-02-10T16:00:00Z",
    created_at: "2024-01-25T10:00:00Z",
  },
  {
    id: "2",
    title: "React Study Group",
    description: "Weekly study group for React developers",
    start_date: "2024-02-12T18:00:00Z",
    end_date: "2024-02-12T19:30:00Z",
    created_at: "2024-01-28T12:00:00Z",
  },
  {
    id: "3",
    title: "Database Design Lecture",
    description: "Advanced database design concepts and best practices",
    start_date: "2024-02-15T10:00:00Z",
    end_date: "2024-02-15T11:30:00Z",
    created_at: "2024-02-01T09:00:00Z",
  },
]

// Mock API responses
export const mockApiResponses = {
  login: {
    token: "mock_jwt_token_12345",
    user: mockUser,
  },
  register: {
    token: "mock_jwt_token_12345",
    user: mockUser,
  },
}
