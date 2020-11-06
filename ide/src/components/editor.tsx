import { bond, Box, on } from '@/dataflow'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker'
import React from 'react'

declare global {
  interface Window { MonacoEnvironment: monaco.Environment | undefined; }
}
self.MonacoEnvironment = { getWorker: () => new EditorWorker() }

type EditorProps = {
  contentB: Box<string>,
  onDirtyChange: (val: boolean) => void
  onContentChange: (val: string) => Promise<void>
}

export default bond(({ contentB, onDirtyChange, onContentChange }: EditorProps) => {
  let ed: monaco.editor.IStandaloneCodeEditor

  const
    divEl = React.createRef<HTMLDivElement>(),
    init = () => {
      if (!divEl.current) return
      ed = monaco.editor.create(divEl.current, {
        value: contentB(),
        language: 'python',
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true
      })

      // Save on Ctrl+S
      ed.addAction({
        id: 'save-content',
        label: 'Save',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        run: async (ed) => {
          await onContentChange(ed.getValue())
          onDirtyChange(false)
        }
      })

      ed.onDidChangeModelContent(() => onDirtyChange(true))
      on(contentB, content => ed.setValue(content))
    },
    dispose = () => ed.dispose(),
    render = () => <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} ref={divEl}></div>
  return { init, render, contentB, dispose }
})