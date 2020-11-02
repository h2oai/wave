import { box, on } from './dataflow'
import { create_app, list_apps, read_file, start_app, stop_app, write_file } from './ide'

const
  newEditor = (appName: string) => {
    const
      contentB = box(''),
      createAppIfNotExists = async () => {
        const apps = await list_apps()
        if (apps.indexOf('sample_app') < 0) {
          await create_app('sample_app')
        }
      },
      loadApp = async () => {
        await createAppIfNotExists() // temporary hack
        const content = await read_file('sample_app', 'app.py')
        editor.contentB(content)
      },
      startApp = async () => {
        await createAppIfNotExists() // temporary hack
        await start_app('sample_app')
      },
      stopApp = async () => {
        await stop_app('sample_app')
      }

    on(contentB, async (content) => {
      await write_file(appName, 'app.py', content)
    })

    return { contentB, loadApp, startApp, stopApp }
  }

export const editor = newEditor('sample_app')
