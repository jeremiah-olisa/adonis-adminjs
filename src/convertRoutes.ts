import AdminJS from 'adminjs'

export const convertToAdonisRoute = (admin: AdminJS, adminRoute: string): string => {
  let rootPath = admin.options.rootPath
  if (rootPath.slice(-1) === '/') {
    rootPath = rootPath.substring(0, rootPath.length - 1)
  }

  return rootPath + adminRoute.replace(/{/g, ':').replace(/}/g, '')
}
