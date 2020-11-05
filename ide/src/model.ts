import { box, on } from '@/dataflow'
import { create_app, list_apps, read_file, start_app, stop_app, write_file } from '@/ide'

export const
  newEditor = (appName: string) => {
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

    on(contentB, async (content) => {
      await write_file(appName, 'app.py', content)
    })

    return { contentB, loadApp, startApp, stopApp }
  }