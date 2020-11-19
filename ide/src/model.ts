import { box, Box } from '@/dataflow'
import { create_app, list_apps, start_app, stop_app } from '@/ide'
import { Position } from 'monaco-editor'

export type Editor = {
  contentB: Box<string>
  cursorPositionB: Box<Position | null>
  startApp: () => Promise<void>
  stopApp: () => Promise<void>
  createAppIfNotExists: () => Promise<void>
}

export const
  newEditor = (appName: string): Editor => {
    const
      contentB = box(''),
      cursorPositionB = box<Position | null>(null),
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

    return { contentB, cursorPositionB, startApp, stopApp, createAppIfNotExists }
  }