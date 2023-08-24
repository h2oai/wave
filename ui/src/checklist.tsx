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
import { B, Id, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Choice } from './choice_group'
import { clas, margin } from './theme'
import { wave } from './ui'

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
  /** True if checklist should be rendered horizontally. Defaults to False. */
  inline?: B
  /** The width of the checklist, e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
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
    inline: {
      display: 'flex',
      flexWrap: 'wrap',
      $nest: {
        '.checklist-item': {
          marginRight: 15
        }
      }
    }
  })

export const
  XChecklist = ({ model: m }: { model: Checklist }) => {
    const
      defaultSelection = React.useMemo(() => new Set<S>(m.values), [m.values]),
      getMappedChoices = React.useCallback(() => m.choices?.map(c => ({ c, selected: defaultSelection.has(c.name) })) || [], [defaultSelection, m.choices]),
      [choices, setChoices] = React.useState(getMappedChoices()),
      capture = (choices: { c: Choice, selected: B }[]) => {
        wave.args[m.name] = choices.filter(({ selected }) => selected).map(({ c }) => c.name)
        if (m.trigger) wave.push()
      },
      select = (value: B) => {
        const _choices = choices.map(({ c, selected }) => ({ c, selected: c.disabled ? selected : value }))
        setChoices(_choices)
        capture(_choices)
      },
      selectAll = () => select(true),
      deselectAll = () => select(false),
      onChange = (idx: U) => (_e?: React.FormEvent<HTMLElement>, checked = false) => {
        const _choices = [...choices]
        _choices[idx].selected = checked
        setChoices(_choices)
        capture(_choices)
      },
      items = choices.map(({ c, selected }, i) => (
        <Fluent.Checkbox
          key={i}
          data-test={`checkbox-${i + 1}`}
          className='checklist-item'
          label={c.label || c.name}
          checked={selected}
          onChange={onChange(i)}
          disabled={!!c.disabled}
          styles={{ root: { marginBottom: 4 }, checkmark: { display: 'flex' } }} // Fix: Center the checkmark in the checkbox.
        />
      ))

    React.useEffect(() => {
      const newChoices = getMappedChoices()
      setChoices(newChoices)
      wave.args[m.name] = newChoices.filter(({ selected }) => selected).map(({ c }) => c.name)
    }, [getMappedChoices, m.choices, m.name, m.values])

    return (
      <div data-test={m.name}>
        <Fluent.Label>{m.label}</Fluent.Label>
        <div className={css.toolbar}>
          <Fluent.Text variant='small'>
            <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
          </Fluent.Text>
        </div>
        <div className={clas(css.items, m.inline ? css.inline : '')}>{items}</div>
      </div>
    )
  }