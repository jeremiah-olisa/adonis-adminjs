declare module '@ioc:Vidiemme/Adminjs/Adonis' {
  import AdminJS from 'adminjs'

  import { RouteContract, RouteGroupContract } from '@ioc:Adonis/Core/Route'

  interface AdminjsAdonis {
    buildRouter(admin: AdminJS): Array<RouteContract>

    buildAuthenticatedRouter(admin: AdminJS): RouteGroupContract
  }

  const AdminjsAdonisInstance: AdminjsAdonis
  export { AdminJS, AdminjsAdonisInstance, AdminjsAdonis }
}
