// Configuration for the application
export const config = {
  // API Configuration
  API_BASE_URL: "https://themirmakhmudov.jprq.site",

  // Development mode - set to true to use mock data when API is unavailable
  DEVELOPMENT_MODE: true,

  // Enable offline mode when API is not accessible
  ENABLE_OFFLINE_MODE: true,

  // Timeout for API requests (in milliseconds)
  API_TIMEOUT: 10000,

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
}

// Check if we're in development environment
export const isDevelopment = process.env.NODE_ENV === "development"
