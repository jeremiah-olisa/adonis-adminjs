import AdminJS from 'adminjs'

import { LoggerContract } from '@ioc:Adonis/Core/Logger'
import { RouteGroupContract, RouterContract } from '@ioc:Adonis/Core/Route'

import { buildRouter } from './buildRouter'
import { buildLogout } from './authentication/logout.handler'
import { buildLoginGet, buildLoginPost } from './authentication/login.handler'
import { withProtectedRoutesHandler } from './authentication/protected-routes.handler'

export const buildAuthenticatedRouter = (
  admin: AdminJS,
  router: RouterContract,
  logger: LoggerContract
): RouteGroupContract => {
  return router.group(() => {
    buildLoginGet(admin, router)
    buildLoginPost(admin, router)
    buildLogout(admin, router)

    buildRouter(admin, router, logger).middleware(withProtectedRoutesHandler(admin))
  })
}
