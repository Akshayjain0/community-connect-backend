class ApiResponse<T = unknown> {
  [x: string]: unknown;
  statusCode: number;
  data: T | null;
  message: string;
  success: boolean;
  stack?: string; // Optional stack property for errors

  constructor(
    statusCode = 200,
    data: T | null = null,
    message = "success",
    stack?: string // Include stack trace if needed
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Success if statusCode < 400
    if (stack) {
      this.stack = stack;
    }
  }
}

export default ApiResponse;
