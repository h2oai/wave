import * as Fluent from '@fluentui/react'
import React from 'react'
import { cards } from './layout'
import { bond, Card, qd, S } from './qd'

/** Create a navigation item. */
interface NavItem {
  /** The name of this item. Prefix the name with a '#' to trigger hash-change navigation. */
  name: S
  /** The label to display. */
  label: S
  /** The icon to be displayed left of the label. Available values are icon names and image urls. */
  icon?: S
}

/** Create a group of navigation items. */
interface NavGroup {
  /** The label to display for this group. */
  label: S
  /** The navigation items contained in this group. */
  items: NavItem[]
}

/** Create a card containing a navigation pane. */
interface State {
  /** The navigation groups contained in this pane. */
  items: NavGroup[]
}

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        const
          onRenderLink = (props?: Fluent.INavLink, defaultRender?: (props?: Fluent.INavLink) => JSX.Element | null) => {
            if (!defaultRender || !props) return null

            const isFluentIcon = !/.+\..+/.test(props.customIcon)
            if (!isFluentIcon) delete props.iconProps?.iconName

            return (
              <Fluent.Stack horizontal verticalAlign='center' horizontalAlign='space-between'>
                {!isFluentIcon && <Fluent.Image src={props.customIcon} width={24} height={24} styles={{ root: { marginRight: 6 } }} />}
                {defaultRender(props)}
              </Fluent.Stack>
            )
          },
          groups = state.items.map((g): Fluent.INavLinkGroup => ({
            name: g.label,
            links: g.items.map(({ name, label, icon }): Fluent.INavLink => ({
              key: name,
              name: label,
              url: '',
              customIcon: icon,
              iconProps: { iconName: icon },
              onClick: () => {
                if (name.startsWith('#')) {
                  window.location.hash = name.substr(1)
                  return
                }
                qd.args[name] = true
                qd.sync()
              }
            })
            )
          }))
        return <div data-test={name}><Fluent.Nav groups={groups} onRenderLink={onRenderLink} /></div>
      }
    return { render, changed }
  })

cards.register('nav', View)
