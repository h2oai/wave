import * as Fluent from '@fluentui/react'
import { Id, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { fixMenuOverflowStyles } from './parts/utils'
import { border, clas, cssVar } from './theme'
import { Command, toCommands } from "./toolbar"

const css = stylesheet({
  card: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    $nest: {
      '&:hover': {
        color: cssVar('$themePrimary')
      },
      '&:hover button': {
        color: cssVar('$themePrimary')
      },
    }
  },
  icon: {
    fontSize: 18
  }
})

/**
  Create a contextual menu component. Useful when you have a lot of links and want to conserve the space.
*/
export interface Menu {
  /** Commands to render. */
  items: Command[]
  /** The card's icon. Mutually exclusive with the image and label. */
  icon?: S
  /** The card’s image, preferably user avatar. Mutually exclusive with the icon and label. */
  image?: S
  /** An identifying name for this component. */
  name?: Id
  /** The text displayed next to the chevron. Mutually exclusive with the icon and image. */
  label?: S
}

export const XMenu = ({ model }: { model: Menu }) => {
  const
    { name, items, icon, image, label } = model,
    ref = React.useRef<HTMLDivElement>(null),
    [isMenuHidden, setIsMenuHidden] = React.useState(true),
    toggleMenu = () => setIsMenuHidden(isHidden => !isHidden)

  return (
    // HACK: Marker css class.
    <div data-test={name} className={clas(css.card, 'w-menu')} ref={ref} onClick={toggleMenu}>
      {image && <Fluent.Persona imageUrl={image} size={Fluent.PersonaSize.size48} styles={{ details: { padding: 0 } }} />}
      {icon && <Fluent.FontIcon className={css.icon} iconName={icon} />}
      {label && <Fluent.Text variant='mediumPlus' styles={{ root: { color: cssVar('$text') } }}>{label}</Fluent.Text>}
      <Fluent.ContextualMenu
        items={toCommands(items)}
        target={ref}
        hidden={isMenuHidden}
        onDismiss={toggleMenu}
        isBeakVisible
        directionalHint={Fluent.DirectionalHint.bottomRightEdge}
        calloutProps={{ styles: { beak: { border: border(1, cssVar('$neutralQuaternaryAlt')) } } }}
        styles={fixMenuOverflowStyles}
      />
      <Fluent.ActionButton iconProps={{ iconName: 'CaretSolidDown', styles: { root: { fontSize: 12 } } }} styles={{ root: { padding: 0 } }} />
    </div>
  )
}