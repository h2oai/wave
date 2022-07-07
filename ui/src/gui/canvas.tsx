import React, { useRef } from "react"
import { useState } from "react"
import { stylesheet } from "typestyle"
import { Widget as LBZone } from "./component_mapping"
import { FlexLayout, FlexSection, Section } from "../page"
import { box, Card, on } from "h2o-wave"
import { Layout, Zone } from "../meta"

const css = stylesheet({
  canvas: {
    display: 'flex',
    flexDirection: 'column',
    flex: 6,
    padding: 24,
    background: "#d3d3d3",
  },
  flexLayoutBackground: {
    height: '100%',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  zone: {
    minHeight: '50px',
    border: '1px dashed salmon',
    marginBottom: '5px',
    display: 'flex',
    // justifyContent: 'end',
    position: 'relative',
    transition: 'all .2s',
    padding: 30,
  },
  zoneLabel: {
    position: 'absolute',
    top: '5px',
    left: '10px',
    zIndex: 1,
  },
  widget: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    cursor: 'pointer',
    zIndex: 2,
  }
})

export const selectedB = box<any>(null)

export const Canvas = (props: any) => {
  
  const zoneId = useRef(1)
  const cardId = useRef(1)

  const [layout, setLayout] = useState<Layout>({
    breakpoint: 'xl', 
    zones: [{
      name: 'main',
      size: '1',
      zones: [],
    }], 
    height: '100%'
  })
  const [cards, setCards] = useState<Card[]>([])

  const onDropOnLayout = (ev: any) => {
    ev.preventDefault()

    const widget: LBZone = JSON.parse(ev.dataTransfer.getData("text"))

    if (widget.name === 'zone') {
      const newZone = createZone(widget.parameters)
      props.onAddZone(newZone, 'xl')
      
      setLayout(layout => ({
        ...layout,
        zones: [...layout.zones, newZone]
      }))
    }

    ev.dataTransfer.clearData()
  }
    
  const findZone = (zones: Zone[] = [], name: string): Zone | undefined => {
    let found = zones.find(z => z.name === name)
    if (found) return found
    for (const z of zones) {
      found = findZone(z.zones, name)
      if (found) return found
    }
  }

  const onDropOnZone = (zoneName: string) => (ev: any) => {
    ev.stopPropagation()
    const widget: LBZone = JSON.parse(ev.dataTransfer.getData("text"))
    
    if (widget.name === 'zone') {
      setLayout(layout => {
        const foundZone = findZone(layout.zones, zoneName)
        foundZone?.zones?.push(createZone(widget.parameters))
        return {...layout}
      })
    }
    
    else if (widget.name.match(/.+card$/i)) {
      const newId = `card_${cardId.current++}`
      widget.parameters.box = zoneName

      const card: Card = {
        id: newId,
        name: newId,
        state: {
          ...widget.parameters
        },
        set: () => { true },
        changed: box<boolean>(),
      }
      setCards(cards => [...cards, card])
      props.onAddCard(card)
    }
  }
  
  const createZone = (parameters: any) => {
    return { ...parameters, name: `zone_${zoneId.current++}` }
  }

  const onDropOnCard = (cardId: string) => (ev: any) => {

    const { name, parameters}: LBZone = JSON.parse(ev.dataTransfer.getData("text"))
    
    if (name.match(/.+_card$/) || name === 'layout' || name === 'zone') return
      
    setCards(cards => {
      const found = cards.find(c => c.id === cardId)
      if (!found) return cards
      return [
        ...cards.filter(c => c !== found),
        {
          ...found,
          state: {
            ...found.state,
            items: [...found.state.items, { [name]: parameters}]
          }
        }
      ]
    })
  }

  const setProperties = (parameters: any, updater: any) => (ev: React.MouseEvent<HTMLElement>) => {
    ev.stopPropagation()
    selectedB({parameters, updater})
  }

  return (
    <div className={css.canvas}>

      <div className={css.flexLayoutBackground}>
        <FlexLayout
          name="flex-test"
          layout={layout}  
          index={0}
          cards={cards}
          onDrop={onDropOnLayout}
          onRenderSection={(section: Section) =>
            <LBZone name={section.zone.name} setLayout={setLayout}>
              <FlexSection
                style={css.zone}
                section={section}
                hasEditor={false}
                onRenderDirectionLabel={(direction: string) => <span className={css.zoneLabel}>{direction === 'row' ? '→' : '↓' ?? ''}</span>}
                onDrop={onDropOnZone}
                setProperties={setProperties}
              />
            </LBZone>
          } 
        />

      </div>
    </div>
  )
}

const removeZone = (zones: Zone[], targetName: string) => {
  for (const zone of zones) {
    if (zone.name === targetName) {
      zones = zone.zones?.filter(z => z.name !== targetName) ?? []
      return zones
    } else {
      removeZone(zone.zones ?? [], targetName)
    }
  }
}

const LBZone = ({ name, children, setLayout }: any) => {

  const deleteWidget = () => {
    console.log('deleting zone')
    setLayout((layout: Layout) => {
      layout.zones = removeZone(layout.zones, name) ?? []
      return layout
    })
  }
  
  return (
    <div className={css.widget}>
      <span onClick={deleteWidget} className={css.deleteButton}>X</span>
      {children}
    </div>
  )
}
