import AdminJS from 'adminjs'

import { RouteContract, RouterContract } from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { AuthenticationMaxRetriesOptions } from '../types'

const getLoginPath = (admin: AdminJS): string => {
  const { loginPath } = admin.options
  return loginPath.startsWith('/') ? loginPath : `/${loginPath}`
}

class Retry {
  private static retriesContainer: Map<string, Retry> = new Map()
  private lastRetry: Date | undefined
  private retriesCount = 0

  constructor(ip: string) {
    const existing = Retry.retriesContainer.get(ip)
    if (existing) {
      return existing
    }
    Retry.retriesContainer.set(ip, this)
  }

  public canLogin(maxRetries: AuthenticationMaxRetriesOptions): boolean {
    if (maxRetries.count <= 0) {
      return true
    }

    if (
      !this.lastRetry ||
      new Date().getTime() - this.lastRetry.getTime() > maxRetries.duration * 1000
    ) {
      this.lastRetry = new Date()
      this.retriesCount = 1
      return true
    } else {
      this.lastRetry = new Date()
      this.retriesCount++
      return this.retriesCount <= maxRetries.count
    }
  }
}

export const buildLoginGet = (admin: AdminJS, router: RouterContract): RouteContract => {
  const loginPath = getLoginPath(admin)

  return router.get(loginPath, async ({ response }: HttpContextContract) => {
    const login = await admin.renderLogin({
      action: admin.options.loginPath,
      errorMessage: null,
    })
    return response.send(login)
  })
}

export const buildLoginPost = (admin: AdminJS, router: RouterContract): RouteContract => {
  const { rootPath } = admin.options
  const loginPath = getLoginPath(admin)

  return router.post(
    loginPath,
    async ({ auth, request, response, session }: HttpContextContract) => {
      if (
        !new Retry(request.ip()).canLogin({
          duration: 60 * 5, // 5 minute
          count: 3,
        })
      ) {
        const login = await admin.renderLogin({
          action: admin.options.loginPath,
          errorMessage: 'tooManyRequests',
        })
        return response.send(login)
      }

      const { email, password } = request.body() as {
        email: string
        password: string
      }
      try {
        await auth.attempt(email, password)
        return response.redirect(session.get('redirectTo', rootPath), false, 302)
      } catch (err) {
        const login = await admin.renderLogin({
          action: admin.options.loginPath,
          errorMessage: 'invalidCredentials',
        })
        return response.send(login)
      }
    }
  )
}
