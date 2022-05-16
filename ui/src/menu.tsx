import * as Fluent from '@fluentui/react'
import { Id, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
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
  /** The card's icon. Mutually exclusive with the image. */
  icon?: S
  /** The card’s image, preferably user avatar. Mutually exclusive with the icon. */
  image?: S
  /** An identifying name for this component. */
  name?: Id
}

export const
  // Styles to remove unnecessary scrollbar that shows up when icons are used in menu items
  fixIconScrollbar = {
    list: {
      border: border(1, cssVar('$neutralQuaternaryAlt')),
      '.ms-ContextualMenu-link': { lineHeight: 'unset' },
      '.ms-ContextualMenu-submenuIcon': { lineHeight: 'unset', display: 'flex', alignItems: 'center' },
    }
  },
  XMenu = ({ model }: { model: Menu }) => {
    const
      { name, items, icon, image } = model,
      ref = React.useRef<HTMLDivElement>(null),
      [isMenuHidden, setIsMenuHidden] = React.useState(true),
      toggleMenu = () => setIsMenuHidden(isHidden => !isHidden)

    return (
      // HACK: Marker css class.
      <div data-test={name} className={clas(css.card, 'w-menu')} ref={ref} onClick={toggleMenu}>
        { image && <Fluent.Persona imageUrl={image} size={Fluent.PersonaSize.size48} styles={{ details: { padding: 0 } }} />}
        { icon && <Fluent.FontIcon className={css.icon} iconName={icon} />}
        <Fluent.ContextualMenu
          items={toCommands(items)}
          target={ref}
          hidden={isMenuHidden}
          onDismiss={toggleMenu}
          isBeakVisible
          directionalHint={Fluent.DirectionalHint.bottomRightEdge}
          calloutProps={{ styles: { beak: { border: border(1, cssVar('$neutralQuaternaryAlt')) } } }}
          styles={fixIconScrollbar}
        />
        <Fluent.ActionButton iconProps={{ iconName: 'CaretSolidDown', styles: { root: { fontSize: 12 } } }} styles={{ root: { padding: 0 } }} />
      </div>
    )
  }