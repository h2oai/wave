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
import { Component, XComponents } from './form'
import { wave } from './ui'

/**
 * Creates a new expander.
 *
 * Expanders can be used to show or hide a group of related components.
 */
export interface Expander {
  /** An identifying name for this component. */
  name: Id
  /** The text displayed on the expander. */
  label?: S
  /** True if expanded, False if collapsed. */
  expanded?: B
  /** List of components to be hideable by the expander. */
  items?: Component[]
  /** The width of the expander, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
}

const
  css = stylesheet({
    expanderOpen: {
      $nest: {
        '>div:last-child': {
          display: 'block',
        },
      },
    },
    expanderClosed: {
      $nest: {
        '>div:last-child': {
          display: 'none',
        },
      },
    },
  })

export const XExpander = ({ model: m }: { model: Expander }) => {
  const
    [isOpen, setIsOpen] = React.useState(m.expanded),
    onClick = React.useCallback(() => {
      wave.args[m.name] = !isOpen
      setIsOpen(!isOpen)
    }, [isOpen, m.name])

  React.useEffect(() => {
    if (m.expanded !== undefined) {
      wave.args[m.name] = !!m.expanded
      setIsOpen(m.expanded)
    }
  }, [m])

  return (
    <div data-test={m.name} className={isOpen ? css.expanderOpen : css.expanderClosed} data-visible={isOpen ? 'visible' : 'hidden'}>
      <Fluent.Separator alignContent="start" styles={{ content: { paddingLeft: 0 } }}>
        <Fluent.ActionButton
          title={isOpen ? 'Shrink' : 'Expand'}
          iconProps={{ iconName: isOpen ? 'ChevronDownMed' : 'ChevronRightMed' }}
          onClick={onClick}
          styles={{ root: { paddingLeft: 0 }, icon: { marginLeft: 0 } }}>{m.label}</Fluent.ActionButton>
      </Fluent.Separator>
      <XComponents items={m.items || []} />
    </div>
  )
}