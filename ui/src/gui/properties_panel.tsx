import { stylesheet } from "typestyle"
import React, { useEffect } from 'react'
import { Properties } from "./properties"
import { selectedB } from "./canvas"
import { on } from "h2o-wave"

const css = stylesheet({
  container: {
    flex: 2,
    background: 'white',
    padding: 20,
  }
})



export const PropertiesPanel = () => {
  const [selected, setSelected] = React.useState<any>({ parameters: {}, updater: () => true})

  useEffect(() => {
    on(selectedB, (selected: Record<string, any>) => {
      setSelected(selected)
    })
  }, [])

  return (
    <div className={css.container}>
      <h2>Properties</h2>
      <Properties selected={selected} />
    </div>
  )
}

const Properties = ({ selected }: { selected: { parameters: Record<string, any>, updater: any } }) => {

  const [parameters, setParameters] = React.useState(selected.parameters)

  React.useEffect(() => {
    setParameters(selected.parameters)
  }, [selected])

  const createOnChange = (prop: string) => (ev: any) => {
    setParameters(parameters => {
      parameters[prop] = ev.target.value
      return {...parameters}
    })
    selected.updater(prop, ev.target.value)
  }

  const canEdit = (key: string) => {
    const nonEditable = ['view', 'items', 'box', 'commands', 'buttons']
    return !nonEditable.includes(key)
  }

  const editables = Object.entries(parameters).filter(([key, _value]) => canEdit(key))

  return (
    <div>
      <div style={{ display: 'flex', padding: 20 }}>
        <div style={{ marginRight: 30 }}>{editables.map(([key, _value]) => <div style={{ marginBottom: 7 }} key={key}>{key}:</div>)}</div>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          {editables.map(([key, value]) =>
            <input style={{ marginBottom: 5 }} onChange={createOnChange(key)} key={key} name={key} type="text" value={value} />)}
        </div>
      </div>
    </div>
  )
}
