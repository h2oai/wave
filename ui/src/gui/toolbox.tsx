import React from 'react' 
import { stylesheet } from "typestyle"
import { WIDGETS, Widget, CARDS, LAYOUT } from "./component_mapping"
import * as Fluent from '@fluentui/react'
import { SelectionMode } from '@fluentui/react'

const css = stylesheet({
  container: {
    border: '1px solid #d8d8d8',
    display: 'flex',
    flexDirection: 'column',
    width: 230,
  },
  list: {
    overflowY: 'auto',
  },
  item: {
    cursor: 'pointer',
    boxSizing: 'border-box',
    color: 'black',
    padding: '8px 16px',
    margin: '2px 20px 0 20px',
    $nest: {
      '&:hover': {
        outline: '1px solid #832161'
      }
    }
  }
})


const DragableComp = (props: { comp: Widget }) => {
  
  const setDragData = (ev: any) => {
    ev.dataTransfer.setData("text/plain", JSON.stringify(props.comp))
  }

  return <div
    className={css.item}
    draggable
    onDragStart={setDragData}
  >
    {props.comp.displayName}
  </div>
}

export const Toolbox = () => {

  const onRenderCell = (
    _nestingDepth?: number,
    item?: any,
    itemIndex?: number,
  ): React.ReactNode => {
    return item && typeof itemIndex === 'number' && itemIndex > -1 ? (
      <DragableComp comp={item} />
    ) : null
  }

  const groups = [
    { key: 'layout', name: 'Layout', startIndex: 0, count: LAYOUT.length},
    { key: 'cards', name: 'Cards', startIndex: 2, count: CARDS.length},
  ]

  return (
    <div className={css.container}>
      <h1 style={{ fontSize: 20, marginLeft: 20 }}>Toolbox</h1>
      <div className={css.list}>
        <Fluent.GroupedList
          items={WIDGETS}
          onRenderCell={onRenderCell}
          groups={groups}
          selectionMode={SelectionMode.none}
        />
      </div>
    </div>
  )
}
