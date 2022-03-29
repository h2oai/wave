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

import { Pivot, PivotItem } from '@fluentui/react'
import { B, Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { Tab } from './tabs'
import { bond, wave } from './ui'

/** Create a card containing tabs for navigation. */
interface State {
  /** The tabs to display in this card */
  items: Tab[]
  /** The name of the tab to select. */
  value?: S
  /** True if tabs should be rendered as links instead of buttons. */
  link?: B
  /** An optional name for the card. If provided, the selected tab can be accessed using the name of the card. */
  name?: S
}

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 46 // HACK: Prevent overflow - https://github.com/h2oai/wave/issues/904.
    },
  })

export const
  XTab = (props: State) => {
    const
      [value, setValue] = React.useState(props.value),
      ref = React.useRef(false),
      onLinkClick = (item?: PivotItem) => {
        const name = item?.props.itemKey
        if (!name) return
        setValue(name)
        ref.current = true
        if (name.startsWith('#')) {
          window.location.hash = name.substr(1)
          return
        }
        if (name) {
          wave.args[String(props.name)] = name
        } else {
          wave.args[String(props.name)] = true
        }
        wave.push()
      },
      linkFormat = props.link ? 'links' : 'tabs',
      items = props.items.map(({ name, label, icon }) => (
        <PivotItem key={name} itemKey={name} headerText={label} itemIcon={icon} />
      ))
    
    React.useLayoutEffect(() => {
      if (!ref.current) {
        setValue(props.value)
      } else {
        ref.current = false
      }
    }, [props])

    return (
      <Pivot linkFormat={linkFormat} onLinkClick={onLinkClick} selectedKey={value}>{items}</Pivot>
    )
  },
  
  View = bond(({ name, state, changed }: Model<State>) => {
    const render = () => (
      <div data-test={name} className={css.card}>
        <XTab {...state} />
      </div>
    )
    return { render, changed }
  })

cards.register('tab', View, { effect: CardEffect.Transparent })
