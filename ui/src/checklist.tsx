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
import { B, box, Box, Id, on, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Choice } from './choice_group'
import { margin } from './theme'
import { bond, wave } from './ui'

/**
 * Create a set of checkboxes.
 * Use this for multi-select scenarios in which a user chooses one or more items from a group of
 * choices that are not mutually exclusive.
 */
export interface Checklist {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed above the component. */
  label?: S
  /** The names of the selected choices. */
  values?: S[]
  /** The choices to be presented. */
  choices?: Choice[]
  /** True if the form should be submitted when the checklist value changes. */
  trigger?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  css = stylesheet({
    toolbar: {
      margin: margin(5, 0)
    },
    items: {
      $nest: {
        '> *': {
          margin: '10px 0',
        }
      },
    },
  }),
  XChecklistItem = bond(({ name, label, disabled, selectedB }: { name: S, label: S, disabled: B, selectedB: Box<B> }) => {
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => selectedB(!!checked),
      render = () => {
        return (
          <Fluent.Checkbox
            data-test={name}
            label={label}
            checked={selectedB()}
            onChange={onChange}
            disabled={disabled}
            styles={{ root: { marginBottom: 4 } }}
          />
        )
      }
    return { render, selectedB }
  })

export const
  XChecklist = bond(({ model: m }: { model: Checklist }) => {
    wave.args[m.name] = m.values || []
    let _pause = false
    const
      defaultSelection = new Set<S>(m.values),
      choices = (m.choices || []).map(c => ({
        choice: c,
        selectedB: box(defaultSelection.has(c.name))
      })),
      capture = () => {
        if (_pause) return
        const vs: S[] = []
        for (const c of choices) if (c.selectedB()) vs.push(c.choice.name)
        wave.args[m.name] = vs
        if (m.trigger) wave.push()
      },
      select = (value: B) => {
        _pause = true
        for (const c of choices) if (!c.choice.disabled) c.selectedB(value)
        _pause = false
        capture()
      },
      selectAll = () => select(true),
      deselectAll = () => select(false),
      render = () => {
        const
          items = choices.map(({ choice, selectedB }, i) => (
            <XChecklistItem name={`checkbox-${i + 1}`} key={i} label={choice.label || choice.name} disabled={!!choice.disabled} selectedB={selectedB} />
          ))
        return (
          <div data-test={m.name}>
            <Fluent.Label>{m.label}</Fluent.Label>
            <div className={css.toolbar}>
              <Fluent.Text variant='small'>
                <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
              </Fluent.Text>
            </div>
            <div className={css.items}>{items}</div>
          </div>
        )
      }
    choices.forEach(c => on(c.selectedB, capture))
    return { render }
  })