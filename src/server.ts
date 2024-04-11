import express, { Application } from 'express'
import { IRouter } from './interfaces/router.interface'
import {callLogger} from "./helpers/logger.helper";

export class Server {
  public express: Application
  public port: number

  constructor(routers: IRouter[]) {
    this.express = express()
    this.port = parseInt(process.env.PORT)

    this.initializeMiddleware()
    this.initializeRouters(routers)
  }

  private initializeMiddleware(): void {
    this.express.use(express.json())
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
