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
import { B, Id, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { bond, wave } from './ui'

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
  /** The name of the tab to select. */
  value?: S
  /** The tabs in this tab bar. */
  items?: Tab[]
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** True if tabs should be rendered as links instead of buttons. */
  link?: B
}

const
  css = stylesheet({
    pivot: {
      // Actual height of the Fluent pivot is 44.
      // When used standalone in a flex layout, scrollbars show up when attempting to fit to content height.
      // So explicitly set a height to work around this issue.
      minHeight: 46,
    }
  })

export const
  XTabs = bond(({ model: m }: { model: Tabs }) => {
    const
      onLinkClick = (item?: Fluent.PivotItem) => {
        const name = item?.props.itemKey
        if (!name) return
        if (name.startsWith('#')) {
          window.location.hash = name.substr(1)
          return
        }
        if (m.name) {
          if (name !== wave.args[m.name]) {
            wave.args[m.name] = name
            wave.push()
          }
        } else {
          wave.args[name] = true
          wave.push()
        }
      },
      render = () => {
        const tabs = m.items?.map(t => (
          <Fluent.PivotItem
            key={t.name}
            itemIcon={t.icon}
            itemKey={t.name}
            headerText={t.label} />
        ))
        return (
          <div className={css.pivot}>
            <Fluent.Pivot
              data-test={m.name}
              selectedKey={m.value ?? null}
              linkFormat={m.link ? Fluent.PivotLinkFormat.links : Fluent.PivotLinkFormat.tabs}
              onLinkClick={onLinkClick}>{tabs}</Fluent.Pivot>
          </div>
        )
      }
    return { render }
  })