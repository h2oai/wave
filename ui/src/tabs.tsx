// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, Id, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { wave } from './ui'
import useUpdateOnlyEffect from './parts/useUpdateOnlyEffectHook'

/**
 * Create a tab.
 */
export interface Tab {
  /** An identifying name for this component. */
  name: Id
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
  name: Id
  /** The name of the tab to select initially. */
  value?: S
  /** The tabs in this tab bar. */
  items?: Tab[]
  /** The width of the tabs, e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** True if tabs should be rendered as links instead of buttons. */
  link?: B
}

const
  css = stylesheet({
    pivot: {
      // Actual height of the Fluent pivot is 44.
      // When used standalone in a flex layout, scrollbars show up when attempting to fit to content height.
      // Explicitly set a height to work around.
      minHeight: 46,
      overflowX: 'auto',
      overflowY: 'hidden'
    }
  })

export const
  XTabs = ({ model: m }: { model: Tabs }) => {
    const
      onLinkClick = (item?: Fluent.PivotItem) => {
        const name = item?.props.itemKey
        if (!name) return
        setSelected(name)
        m.value = name
        if (name.startsWith('#')) {
          window.location.hash = name.substring(1)
          return
        }
        if (m.name) {
          if (name !== selected) {
            wave.args[m.name] = name
            wave.push()
          }
        } else {
          wave.args[name] = true
          wave.push()
        }
      },
      tabs = m.items?.map(t => <Fluent.PivotItem key={t.name} itemIcon={t.icon} itemKey={t.name} headerText={t.label} />),
      [selected, setSelected] = React.useState(m.value || m.items?.[0].name)

    useUpdateOnlyEffect(() => setSelected(m.value), [m.value])

    return (
      <div className={css.pivot}>
        <Fluent.Pivot
          data-test={m.name}
          className={m.link ? 'w-tabs-link' : 'w-tabs'} //HACK: Marker classes.
          selectedKey={selected}
          linkFormat={m.link ? 'links' : 'tabs'}
          onLinkClick={onLinkClick}>{tabs}</Fluent.Pivot>
      </div>
    )
  }