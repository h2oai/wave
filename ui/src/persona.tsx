import * as Fluent from '@fluentui/react'
import { Id, S } from './core'
import React from 'react'
import { cssVar } from './theme'
import { wave } from './ui'


/** 
  * Create an individual's persona or avatar, a visual representation of a person across products. 
  * Can be used to display an individual's avatar (or a composition of the person’s initials on a background color), their name or identification, and online status.
*/
export interface Persona {
  /** Primary text, displayed next to the persona coin. */
  title: S
  /** Secondary text, displayed under the title. */
  subtitle?: S
  /** Tertiary text, displayed under the subtitle. Only visible for sizes >= 'm'. */
  caption?: S
  /** The size of the persona coin. Defaults to 'm'. */
  size?: 'xl' | 'l' | 'm' | 's' | 'xs'
  /** Image, URL or base64-encoded (`data:image/png;base64,???`). */
  image?: S
  /** Initials, if `image` is not specified. */
  initials?: S
  /** Initials background color (CSS-compatible string). */
  initials_color?: S
  /** An identifying name for this component. */
  name?: Id
}

const fluentPersonaSizes: { [K in 'xs' | 's' | 'm' | 'l' | 'xl']: Fluent.PersonaSize } = {
  'xs': Fluent.PersonaSize.size48,
  's': Fluent.PersonaSize.size56,
  'm': Fluent.PersonaSize.size72,
  'l': Fluent.PersonaSize.size100,
  'xl': Fluent.PersonaSize.size120,
}

export const XPersona = ({ model }: { model: Persona }) => {
  const onClick = () => {
    if (model.name) {
      if (model.name.startsWith('#')) {
        window.location.hash = model.name.substring(1)
        return
      }
      wave.args[model.name] = true
      wave.push()
    }
  }

  return (
    <div data-test={model.name} onClick={onClick}>
      <Fluent.Persona
        styles={{ root: { cursor: model.name ? 'pointer' : 'initial' }, details: { paddingRight: 0 } }}
        text={model.title}
        secondaryText={model.subtitle}
        tertiaryText={model.caption}
        imageUrl={model.image}
        imageInitials={model.initials}
        initialsColor={cssVar(model.initials_color)}
        size={model.size ? fluentPersonaSizes[model.size] : Fluent.PersonaSize.size72}
      />
    </div>
  )
}
