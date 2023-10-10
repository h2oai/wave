import * as Fluent from '@fluentui/react'
import { Id, S, U } from './core'
import React from 'react'
import { Component } from './form'
import { cssVar } from './theme'
import { wave } from './ui'

/** 
 * A face pile displays a list of personas. Each circle represents a person and contains their image or initials.
 * Often this control is used when sharing who has access to a specific view or file.
*/
export interface Facepile {
  /** List of personas to be displayed. */
  items: Component[]
  /** An identifying name for this component. If specified `Add button` will be rendered. */
  name?: Id
  /** Maximum number of personas to be displayed. */
  max?: U
  /** A value for the facepile. If a value is set, it is used for the button's submitted instead of a boolean True. */
  value?: S
}

export const XFacepile = ({ model }: { model: Facepile }) => {
  const
    { name, max, items, value } = model,
    onClick = () => {
      if (name) {
        if (name.startsWith('#')) {
          window.location.hash = name.substring(1)
          return
        }
        wave.args[name] = value === undefined || value
        wave.push()
      }
    },
    toFacepilePersona = (personas: Fluent.IFacepilePersona[], { persona }: Component) => {
      if (persona) {
        const { title, image, initials } = persona
        personas.push({ personaName: title, imageUrl: image, imageInitials: initials })
      }
      return personas
    }

  return (
    <div data-test={name}>
      <Fluent.Facepile
        styles={{
          addButton: { '.ms-Persona-initials': { background: cssVar('$themePrimary'), color: cssVar('$card') } },
          descriptiveOverflowButton: {
            '.ms-Persona-initials': { background: cssVar('$neutralLighter') },
            '.ms-Persona-initials>span': { color: cssVar('$text') },
          }
        }}
        personas={items.reduce(toFacepilePersona, [])}
        maxDisplayablePersonas={max}
        showAddButton={!!name}
        addButtonProps={{ onClick }}
        overflowButtonProps={{}} //HACK: Keep here, otherwise will not be rendered.
        overflowButtonType={Fluent.OverflowButtonType.descriptive}
      />
    </div>
  )
}
