import { box, Box } from '@/dataflow'
import { create_app, list_apps, read_file, start_app, stop_app } from '@/ide'

export type Editor = {
  contentB: Box<string>
  startApp: () => Promise<void>
  stopApp: () => Promise<void>
  createAppIfNotExists: () => Promise<void>
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
      startApp = async () => {
        await start_app(appName)
      },
      stopApp = async () => {
        await stop_app(appName)
      }

    return { contentB, startApp, stopApp, createAppIfNotExists }
  }