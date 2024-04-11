import pretty from 'pino-pretty'
import pino, { Logger } from 'pino'
import { NextFunction, Request, Response } from 'express'

const stream = pretty({
  colorize: true,
  ignore: 'pid,hostname',
  translateTime: 'HH:MM:ss'
})
export const log: Logger = pino(stream)

export const callLogger = (req: Request, res: Response, next: NextFunction) => {
  log.info(`${req.method} request to "${req.url}" by ${req.hostname}`)
  next()
}
