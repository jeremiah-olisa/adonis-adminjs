import { pathToRegexp } from 'path-to-regexp'
import AdminJS, { Router as AdminRouter } from 'adminjs'

import { RouteMiddlewareHandler } from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { convertToAdonisRoute } from '../convertRoutes'

export const withProtectedRoutesHandler = (admin: AdminJS): RouteMiddlewareHandler => {
  return async ({ request, response, session, auth }: HttpContextContract) => {
    let skip = false

    const { rootPath, loginPath, logoutPath } = admin.options

    if (isAdminAsset(request.url())) {
      skip = true
    }

    if (request.url().startsWith(loginPath) || request.url().startsWith(logoutPath)) {
      skip = true
    }

    if (!skip || isAdminRoute(request.url(), rootPath, admin)) {
      await auth.check()
      if (!auth.isLoggedIn) {
        // If the redirection is caused by API call to some action just redirect to resource
        const [redirectTo] = request.url().split('/actions')
        session.put('redirectTo', redirectTo.includes(`${rootPath}/api`) ? rootPath : redirectTo)

        return response.redirect(loginPath)
      }
    }
  }
}

export const isAdminRoute = (url: string, adminRootPath: string, admin: AdminJS): boolean => {
  const adminRoutes = AdminRouter.routes
    .map((route) => convertToAdonisRoute(admin, route.path))
    .filter((route) => route !== '')

  let urlWithoutAdminRootPath = url
  if (adminRootPath !== '/') {
    urlWithoutAdminRootPath = url.replace(adminRootPath, '')
    if (!urlWithoutAdminRootPath.startsWith('/')) {
      urlWithoutAdminRootPath = `/${urlWithoutAdminRootPath}`
    }
  }

  const isAdminRootUrl = url === adminRootPath

  return (
    isAdminRootUrl ||
    !!adminRoutes.find((route) => pathToRegexp(route).test(urlWithoutAdminRootPath))
  )
}

const isAdminAsset = (url: string) => AdminRouter.assets.find((asset) => url.match(asset.path))
