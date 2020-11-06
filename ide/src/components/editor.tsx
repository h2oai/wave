import { on, bond, box } from '@/dataflow'
import { newEditor } from '@/model'
import * as Fluent from '@fluentui/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker'
import React from 'react'

declare global {
  interface Window { MonacoEnvironment: monaco.Environment | undefined; }
}
self.MonacoEnvironment = { getWorker: () => new EditorWorker() }

type EditorProps = {
  appName: string,
  setIsDirty: (val: boolean) => void
}

export default bond(({ appName, setIsDirty }: EditorProps) => {
  let ed: monaco.editor.IStandaloneCodeEditor

  const
    divEl = React.createRef<HTMLDivElement>(),
    editor = newEditor(appName),
    isLoadingB = box(true),
    init = async () => {
      await editor.loadApp()
      try {
        await editor.startApp()
      }
      catch (error) {
        /* noop */
      }
      finally {
        isLoadingB(false)
      }
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
      ed.onDidChangeModelContent(() => setIsDirty(true))

      on(editor.contentB, (content) => {
        if (isCapturing) return
        ed.setValue(content)
      })
    },
    dispose = () => {
      ed.dispose()
      editor.stopApp()
    },
    render = () => (
      <>
        {
          isLoadingB() &&
          <Fluent.Stack horizontalAlign='center' verticalAlign='center' styles={{ root: { height: '100%' } }}>
            <Fluent.Spinner label='Loading editor' size={Fluent.SpinnerSize.large} />
          </Fluent.Stack>
        }
        <div style={{ width: '100%', height: '100%', display: isLoadingB() ? 'none' : 'block', overflow: "hidden" }} ref={divEl}></div>
      </>
    )
  return { init, render, isLoadingB, dispose }
})