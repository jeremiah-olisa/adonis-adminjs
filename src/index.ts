import AdminJS from 'adminjs'

import { LoggerContract } from '@ioc:Adonis/Core/Logger'
import { RouteGroupContract, RouterContract } from '@ioc:Adonis/Core/Route'

import { buildRouter } from './buildRouter'
import { buildAuthenticatedRouter } from './buildAuthenticatedRouter'

export const name = 'AdminJSAdonis'

export class AdminjsAdonis {
  constructor(protected logger: LoggerContract, protected route: RouterContract) {}

  public buildRouter(admin: AdminJS): RouteGroupContract {
    return buildRouter(admin, this.route, this.logger)
  }

  public buildAuthenticatedRouter(admin: AdminJS): RouteGroupContract {
    return buildAuthenticatedRouter(admin, this.route, this.logger)
  }
}
