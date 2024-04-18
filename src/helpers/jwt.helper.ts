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

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '')
  if (!accessToken) return next()

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string)
  if (decoded) res.locals.user = decoded

  return next()
}

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user
  if (!user) return res.sendStatus(403)
  return next()
}

export const requireAssociation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const association = res.locals.association
  if (!association) return res.sendStatus(403)
  return next()
}
