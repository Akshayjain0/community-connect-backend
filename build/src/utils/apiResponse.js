"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(statusCode = 200, data = null, message = "success", stack // Include stack trace if needed
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
exports.default = ApiResponse;
