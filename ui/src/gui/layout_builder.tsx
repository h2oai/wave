import { Card } from 'h2o-wave'
import React, { useState } from 'react' 
import { stylesheet } from 'typestyle' 
import { Layout, Zone } from '../meta'
import { Canvas } from './canvas' 
import { Toolbox } from './toolbox'
import { Editor } from './editor'
import { generateCode } from './generator'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { PropertiesPanel } from './properties_panel'

const css = stylesheet({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
},
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    height: 60,
    backgroundColor: 'black',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginLeft: 20,
    fontSize: 26,
    color: 'white',
  },
  body: {
    display: 'flex',
    flex: 1,
    height: '90%',
  },
  devTools: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: '#6562ae',
    color: 'white',
  }
})

function LayoutBuilder() {

  const [layouts, setLayouts] = useState<Layout[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [pythonCode, setPythonCode] = useState<string>('')
  const [previewMode, setPreviewMode] = useState(false)
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

  const onAddLayout = (newLayout: Layout) => {
    if (layouts.some(layout => layout.breakpoint === newLayout.breakpoint)) return
    setLayouts(layouts => [...layouts, {...newLayout}])
  }

  const onAddZone = (newZone: Zone, layoutBreakpoint: string) => {
      setLayouts(layouts => {
        const layout = layouts.find(l => l.breakpoint === layoutBreakpoint)
        if (!layout) return layouts
        layout.zones = [...layout.zones, newZone]

        const newLayouts = [
          ...layouts.filter(l => l.breakpoint !== layoutBreakpoint),
          layout,
        ]
        
        return newLayouts
      })
  }

  const onAddCard = (newCard: Card) => {
    setCards(cards => [...cards, newCard])
  }

  const run = () => {
    const logic = editor?.getValue()
    const generated = generateCode(layouts, cards, logic)
    setPythonCode(generated)
    sendCodeToProxy(generated)
    setPreviewMode(true)
  }
  
  const sendCodeToProxy = (code: string) => {
    fetch('http://localhost:2000', {
      method: 'POST',
      body: code
    })
  }
  
  return (
    <div className={css.container}>
      <header className={css.header}>
        <div className={css.headerLeft}>
          <img src="logo192.png" alt="" width={50} />
          <span className={css.title}>Layout Builder</span>
        </div>
        <button onClick={run}>Run</button> 
      </header>
      <div className={css.body}>
        <Toolbox />
        {previewMode
          ?
          <div style={{ flex: 4 }}>
            <iframe
              src="http://localhost:3000/demo"
              width='500'
              height='800'
            />
          </div>
          :
          <Canvas
            onAddLayout={onAddLayout}
            onAddZone={onAddZone}
            onAddCard={onAddCard}
          />
        }
        <PropertiesPanel></PropertiesPanel>
        {/* <Editor setEditor={setEditor} /> */}
      </div>

      {/* <div className={css.devTools}>
        <h3 style={{ color: 'white' }}>Dev tools</h3>
        <pre>{pythonCode}</pre>
        <div>
          <button onClick={checkCode}>Generate Python Code</button>
        </div>
      </div> */}
    </div>
  ) 
}
 
export default LayoutBuilder 
