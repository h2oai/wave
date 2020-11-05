import { on } from '@/dataflow'
import { newEditor } from '@/model'
import * as monaco from 'monaco-editor'
import React from 'react'
import * as Fluent from '@fluentui/react'


// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, label: string) {
    if (label === 'json') {
      return './json.worker.bundle.js'
    }
    if (label === 'css') {
      return './css.worker.bundle.js'
    }
    if (label === 'html') {
      return './html.worker.bundle.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.bundle.js'
    }
    return './editor.worker.bundle.js'
  }
}

type EditorProps = {
  appName: string,
  setIsDirty: (val: boolean) => void
}
export const Editor = ({ appName, setIsDirty }: EditorProps) => {
  const
    divEl = React.useRef<HTMLDivElement>(null),
    editor = newEditor(appName),
    [isLoading, setIsLoading] = React.useState(true)

  let
    ed: monaco.editor.IStandaloneCodeEditor,
    isInitialized = false

  React.useEffect(() => {
    const init = async () => {
      await editor.loadApp()
      try {
        await editor.startApp()
      }
      catch (error) {
        /* noop */
      }
      finally {
        setIsLoading(false)
        isInitialized = true
      }
    }
    init()

    return () => {
      ed.dispose()
      editor.stopApp()
    }
  }, [])

  React.useLayoutEffect(() => {
    if (!divEl.current) return
    ed = monaco.editor.create(divEl.current, {
      value: editor.contentB(),
      language: 'python',
      theme: 'vs-dark',
      minimap: { enabled: false },
      automaticLayout: true
    })

    // Save on Ctrl+S
    let isCapturing = false
    ed.addAction({
      id: 'save-content',
      label: 'Save',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
      run: (ed) => {
        isCapturing = true
        editor.contentB(ed.getValue())
        isCapturing = false
        setIsDirty(false)
      }
    })
    ed.onDidChangeModelContent(() => { if (isInitialized) setIsDirty(true) })

    on(editor.contentB, (content) => {
      if (isCapturing) return
      ed.setValue(content)
    })
  }, [])

  return (
    <>
      {
        isLoading &&
        <Fluent.Stack horizontalAlign='center' verticalAlign='center' styles={{ root: { height: '100%' } }}>
          <Fluent.Spinner label='Loading editor' size={Fluent.SpinnerSize.large} />
        </Fluent.Stack>
      }
      <div style={{ width: '100%', height: '100%', display: isLoading ? 'none' : 'block' }} ref={divEl}></div>
    </>
  )
}
