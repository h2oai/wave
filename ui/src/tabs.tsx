import * as Fluent from '@fluentui/react'
import React from 'react'
import { bond, S, qd, B } from './qd'
import { displayMixin } from './theme'

/**
 * Create a tab.
 */
export interface Tab {
  /** An identifying name for this component. */
  name: S
  /** The text displayed on the tab. */
  label?: S
  /** The icon displayed on the tab. */
  icon?: S
}

/**
 * Create a tab bar.
 */
export interface Tabs {
  /** An identifying name for this component. */
  name: S
  /** The name of the tab to select. */
  value?: S
  /** The tabs in this tab bar. */
  items?: Tab[]
  /** True if the component should be visible. Defaults to true. */
  visible?: B
}

export const
  XTabs = bond(({ model: m }: { model: Tabs }) => {
    const
      onLinkClick = (item?: Fluent.PivotItem) => {
        if (!item) return
        if (item.props.itemKey !== qd.args[m.name]) {
          qd.args[m.name] = item.props.itemKey || null
          qd.sync()
        }
      },
      render = () => {
        const tabs = m.items?.map(t => <Fluent.PivotItem key={t.name} itemIcon={t.icon} itemKey={t.name} headerText={t.label} />)
        return <Fluent.Pivot data-test={m.name} style={displayMixin(m.visible)} selectedKey={m.value ?? null} onLinkClick={onLinkClick}>{tabs}</Fluent.Pivot>
      }
    return { render }
  })