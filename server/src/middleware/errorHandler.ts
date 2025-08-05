import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // MySQL duplicate key error
  if (err.message.includes("Duplicate entry")) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 } as AppError;
  }

  // MySQL validation error
  if (err.message.includes("Validation failed")) {
    const message = "Validation failed";
    error = { message, statusCode: 400 } as AppError;
  }

  // MySQL foreign key constraint error
  if (err.message.includes("Cannot add or update a child row")) {
    const message = "Referenced record does not exist";
    error = { message, statusCode: 400 } as AppError;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
