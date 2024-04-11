import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { log } from './logger.helper'

export const maxAge = 3 * 24 * 60 * 60

export function createToken(id: number, userEmail: string) {
  return jwt.sign({ id, userEmail }, process.env.JWT_SECRET as string, {
    expiresIn: maxAge
  })
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    if (!decoded)
      return res.status(401).json({
        error: 401,
        message: 'Authentication failed'
      })
    log.info(decoded)
    next()
  } else {
    res.status(401).json({
      error: 401,
      message: 'Authentication failed'
    })
  }
}
