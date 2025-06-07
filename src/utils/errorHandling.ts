export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class WeatherError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = "WeatherError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const createUserFriendlyError = (error: any): AppError => {
  // Network errors
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      message:
        "Unable to connect to weather service. Please check your internet connection.",
      code: "NETWORK_ERROR",
      statusCode: 0,
    };
  }

  // API errors
  if (error.statusCode) {
    switch (error.statusCode) {
      case 404:
        return {
          message: "City not found. Please check the spelling and try again.",
          code: "CITY_NOT_FOUND",
          statusCode: 404,
        };
      case 401:
        return {
          message:
            "Weather service authentication failed. Please try again later.",
          code: "AUTH_ERROR",
          statusCode: 401,
        };
      case 429:
        return {
          message: "Too many requests. Please wait a moment and try again.",
          code: "RATE_LIMIT",
          statusCode: 429,
        };
      case 500:
      case 502:
      case 503:
        return {
          message:
            "Weather service is temporarily unavailable. Please try again later.",
          code: "SERVICE_ERROR",
          statusCode: error.statusCode,
        };
      default:
        return {
          message: "An unexpected error occurred. Please try again.",
          code: "UNKNOWN_ERROR",
          statusCode: error.statusCode,
        };
    }
  }

  // Geolocation errors
  if (
    error.message?.includes("location") ||
    error.message?.includes("geolocation")
  ) {
    return {
      message:
        "Location access denied or unavailable. Please search for a city manually.",
      code: "LOCATION_ERROR",
    };
  }

  // Timeout errors
  if (error.name === "AbortError" || error.message?.includes("timeout")) {
    return {
      message: "Request timed out. Please check your connection and try again.",
      code: "TIMEOUT_ERROR",
    };
  }

  // Default error
  return {
    message: error.message || "An unexpected error occurred. Please try again.",
    code: "UNKNOWN_ERROR",
  };
};

export const logError = (error: any, context?: string) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // In development, log to console
  if (import.meta.env.DEV) {
    console.error("Weather App Error:", errorInfo);
  }

  // In production, you might want to send to an error tracking service
  // Example: Sentry, LogRocket, etc.
};

export const handleAsyncError = <T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: AppError) => void
) => {
  return async (): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      const appError = createUserFriendlyError(error);
      logError(error, "AsyncHandler");

      if (errorHandler) {
        errorHandler(appError);
      }

      return null;
    }
  };
};

// Retry logic for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i === retries) {
        throw error;
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }

  throw lastError;
};
