import express, { Application } from 'express'
import { IRouter } from './interfaces/router.interface'
import { callLogger } from './helpers/logger.helper'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from './helpers/error.helper'
import cors, { CorsOptions } from 'cors'
import { deserializeUser } from './helpers/jwt.helper'

export class Server {
  public express: Application
  public port: number

  private whitelist: string[] = []
  private corsOptions: CorsOptions = {}

  constructor(routers: IRouter[]) {
    this.express = express()
    this.port = parseInt(process.env.PORT as string)

    this.initializeMiddleware()
    this.initializeRouters(routers)
  }

  private initializeMiddleware(): void {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(cookieParser())
    this.express.use(errorMiddleware)
    this.express.use(deserializeUser)
  }

  private initializeRouters(routers: IRouter[]): void {
    routers.forEach(router => {
      this.express.use('/api', callLogger, router.router)
    })
  }

  public listen(): void {
    this.express.listen(this.port, (): void => {
      console.log(`Server is up and running on http://localhost:${this.port}`)
    })
  }
}
