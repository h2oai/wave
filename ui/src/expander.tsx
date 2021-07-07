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
import { B, box, Id, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { bond, wave } from './ui'

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
  /** True if the component should be visible. Defaults to true. */
  visible?: B
}

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
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

export const
  XExpander = bond(({ model: m }: { model: Expander }) => {
    const
      isOpenB = box(!!wave.args[m.name]),
      onClick = () => {
        wave.args[m.name] = m.expanded = !m.expanded
        isOpenB(m.expanded)
      },
      render = () => {
        const
          isOpen = isOpenB(),
          actionTitle = isOpen ? 'Shrink' : 'Expand',
          expanderIcon = { iconName: isOpen ? 'ChevronDownMed' : 'ChevronRightMed' },
          className = isOpenB() ? css.expanderOpen : css.expanderClosed

        return (
          <div data-test={m.name} className={className}>
            <Fluent.Separator alignContent="start" styles={{ content: { paddingLeft: 0 } }}>
              <Fluent.ActionButton
                title={actionTitle}
                iconProps={expanderIcon}
                onClick={onClick}
                styles={{ root: { paddingLeft: 0 }, icon: { marginLeft: 0 } }}>{m.label}</Fluent.ActionButton>
            </Fluent.Separator>
            <XComponents items={m.items || []} />
          </div>
        )
      }
    return { isOpenB, render }
  })