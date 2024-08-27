import { Request, Response } from 'express'
import { IgniteService } from '../services/ignite.service'

export class HealthcheckController {
  static async publicCheck(req: Request, res: Response) {
    res.status(200).json({
      status: 'success',
      message: 'Public handshake'
    })
  }

  static async privateCheck(req: Request, res: Response) {
    res.status(200).json({
      status: 'success',
      message: 'Private handshake'
    })
  }

  static async ignite(req: Request, res: Response) {
    await IgniteService.ignite()
    res.status(200).json({
      status: 'success',
      message: 'Ignite done'
    })
  }
}
