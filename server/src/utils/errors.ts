/**
 * Base application error class.
 * Used as the parent for all custom errors.
 * Contains a status code and a flag for operational errors.
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error thrown when validation of input fails.
 * Corresponds to HTTP 400 Bad Request.
 */
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = "ValidationError";
    }
}

/**
 * Error thrown when a requested resource is not found.
 * Corresponds to HTTP 404 Not Found.
 */
export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
        this.name = "NotFoundError";
    }
}

/**
 * Error thrown when authentication fails or is missing.
 * Corresponds to HTTP 401 Unauthorized.
 */
export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
        this.name = "UnauthorizedError";
    }
}

/**
 * Error thrown when a user does not have permission to access a resource.
 * Corresponds to HTTP 403 Forbidden.
 */
export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
        this.name = "ForbiddenError";
    }
}

/**
 * Error thrown when a request could not be completed due to a conflict with the current state.
 * Corresponds to HTTP 409 Conflict.
 */
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
        this.name = "ConflictError";
    }
}
