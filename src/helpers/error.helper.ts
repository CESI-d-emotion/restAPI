import { NextFunction, Request, Response } from 'express'

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  res.status(error.status).json({
    status,
    message
  })
}

class HttpException extends Error {
  public status: number
  public message: string

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.message = message
  }
}
