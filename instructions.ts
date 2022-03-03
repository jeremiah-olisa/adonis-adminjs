import { join } from 'path'
import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

function getStub(...relativePaths: string[]) {
  return join(__dirname, 'templates', ...relativePaths)
}

/**
 * Register preload
 */
function registerPreload(projectRoot: string, app: ApplicationContract, sink: typeof sinkStatic) {
  const preloadFilePath = app.makePath('start/adminjs.ts')
  const adminjsPreloadFile = new sink.files.MustacheFile(
    projectRoot,
    preloadFilePath,
    getStub('adminjs.txt')
  )

  adminjsPreloadFile.overwrite = true

  adminjsPreloadFile.commit()
  sink.logger.action('create').succeeded('start/adminjs.ts')

  const preload = new sink.files.AdonisRcFile(projectRoot)
  preload.setPreload('./start/adminjs')
  preload.commit()

  sink.logger.action('update').succeeded('.adonisrc.json')
}

/**
 * Instructions to be executed when setting up the package.
 */
export default async function instructions(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  registerPreload(projectRoot, app, sink)
}
