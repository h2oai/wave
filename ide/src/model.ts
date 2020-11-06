import { box, Box } from '@/dataflow'
import { create_app, list_apps, read_file, start_app, stop_app } from '@/ide'

export type Editor = {
  contentB: Box<string>
  loadApp: () => Promise<void>
  startApp: () => Promise<void>
  stopApp: () => Promise<void>
}

export const
  newEditor = (appName: string): Editor => {
    const
      contentB = box(''),
      createAppIfNotExists = async () => {
        const apps = await list_apps()
        if (apps.indexOf(appName) < 0) {
          await create_app(appName)
        }
      },
      loadApp = async () => {
        await createAppIfNotExists() // temporary hack
        const content = await read_file(appName, 'app.py')
        contentB(content)
      },
      startApp = async () => {
        await createAppIfNotExists() // temporary hack
        await start_app(appName)
      },
      stopApp = async () => {
        await stop_app(appName)
      }

    return { contentB, loadApp, startApp, stopApp }
  }