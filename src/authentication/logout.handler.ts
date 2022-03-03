import AdminJS from 'adminjs'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RouteContract, RouterContract } from '@ioc:Adonis/Core/Route'

const getLogoutPath = (admin: AdminJS) => {
  const { logoutPath } = admin.options
  return logoutPath.startsWith('/') ? logoutPath : `/${logoutPath}`
}

export const buildLogout = (admin: AdminJS, router: RouterContract): RouteContract => {
  const logoutPath = getLogoutPath(admin)

  return router.get(logoutPath, async ({ auth, response }: HttpContextContract) => {
    await auth.logout()
    return response.redirect(admin.options.loginPath)
  })
}
