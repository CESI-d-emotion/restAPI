import { NextFunction, Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import { log } from './logger.helper'
import { db } from './db.helper'

// export const authentification = (req: Request, res: Response, next: NextFunction) => {
//     const header = req.headers.authorization
//     if (!header) {
//         return res.status(401).json({error: 401, message: 'Unauthorized'})
//     }
//
//     const token = header.split(" ")[1]
//     if (!token) {
//         return res.status(401).json({error: 401, message: 'Unauthorized'})
//     }
//
//     const decode = jwt.verify(token, process.env.JWT_SECRET)
//     if (!decode) {
//         return res.status(401).json({error: 401, message: 'Unauthorized'})
//     }
//
//     req[" currentUser"] = decode
//     next()
// }
//
// export const authorization = (roles: number[]) => {
//     return async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
//         const userRepo = db.users
//         const user = await userRepo.findFirst({
//             where: {id: req[" currentUser"].id}
//         })
//         log.info(user)
//
//         if (!roles.includes(user.roleId)) {
//             return res.status(403).json({error: 403, message: 'Forbidden'})
//         }
//         next()
//     }
// }
