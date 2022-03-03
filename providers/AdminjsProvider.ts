import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Adminjs service provider
 */
export default class AdminjsProvider {
  constructor(protected app: ApplicationContract) {}

  public static needsApplication = true

  /**
   * Called when registering providers
   */
  public register(): void {
    this.app.container.singleton('Vidiemme/Adminjs/Adonis', () => {
      const AdminJS = require('adminjs')
      const { AdminjsAdonis } = require('../src/index')

      const logger = this.app.container.use('Adonis/Core/Logger')
      const route = this.app.container.use('Adonis/Core/Route')

      const adminjsAdonis = new AdminjsAdonis(logger, route)

      return {
        AdminJS,
        AdminjsAdonis,
        AdminjsAdonisInstance: adminjsAdonis,
      }
    })
  }

  /**
   * Called when all bindings are in place
   */
  public boot(): void {}
}
