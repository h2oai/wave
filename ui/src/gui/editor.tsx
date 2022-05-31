import React, { useEffect, useRef, useState } from 'react'
import { stylesheet } from 'typestyle'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

const css = stylesheet({
  container: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    padding: 24,
    borderLeft: '1px solid #d8d8d8'
  },
  title: {
    marginBottom: 12,
  },
  editor: {
    height: 800,
    border: '1px solid #d8d8d8',
  },
})

export const Editor = (props: any) => {

  const
    [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null),
    monacoEl = useRef(null)

  useEffect(() => {
    if (monacoEl && !editor) {
      const newEditor = monaco.editor.create(monacoEl.current!, {
        value: '',
        language: 'python',
        padding: { top: 20 },
        minimap: { enabled: false },
      })
      props.setEditor(newEditor)
      setEditor(newEditor) 
    }

    return () => editor?.dispose()
  }, [monacoEl.current])

  return (
    <div className={css.container}>
      <h2 className={css.title}>Editor</h2>
      <div className={css.editor} ref={monacoEl}></div>
    </div>
  )
}