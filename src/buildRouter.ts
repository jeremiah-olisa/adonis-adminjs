import path from 'path'
import AdminJS, { Router as AdminRouter } from 'adminjs'

import { LoggerContract } from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RouteGroupContract, RouteHandler, RouterContract } from '@ioc:Adonis/Core/Route'

import { convertToAdonisRoute } from './convertRoutes'

export const buildRouter = (
  admin: AdminJS,
  router: RouterContract,
  logger: LoggerContract
): RouteGroupContract => {
  if (admin?.constructor?.name !== 'AdminJS') {
    throw new Error('WrongArgumentError(INVALID_ADMINJS_INSTANCE)') // WrongArgumentError(INVALID_ADMINJS_INSTANCE)
  }

  admin.initialize().then(() => {
    logger.debug('AdminJS: bundle ready')
  })

  const { routes, assets } = AdminRouter

  return router.group(() => {
    routes.forEach((route) => {
      // we have to change routes defined in AdminJS from {recordId} to :recordId
      const adonisPath = convertToAdonisRoute(admin, route.path)

      const handler: RouteHandler = async ({ request, response, auth }: HttpContextContract) => {
        const controller = new route.Controller({ admin }, auth.user)
        const params = request.params()
        const query = request.qs()
        const method = request.method().toLocaleLowerCase()
        const payload = {
          ...request.body(),
          ...(request.allFiles() || {}),
        }

        const html = await controller[route.action]({
          params,
          query,
          payload,
          method,
        })

        if (route.contentType) {
          response.header('Content-Type', route.contentType)
        }

        if (html) {
          response.send(html)
        }
      }

      if (route.method === 'GET') {
        router.get(adonisPath, handler)
      }

      if (route.method === 'POST') {
        router.post(adonisPath, handler)
      }
    })

    assets.forEach((asset) => {
      router.get(
        convertToAdonisRoute(admin, asset.path),
        async ({ response }: HttpContextContract) => {
          response.download(path.resolve(asset.src))
        }
      )
    })
  })
}
