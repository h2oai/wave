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
import { Choice } from './choice_group'
import { bond, wave } from './ui'

/**
 * Create a dropdown.
 *
 * A dropdown is a list in which the selected item is always visible, and the others are visible on demand by clicking
 * a drop-down button. They are used to simplify the design and make a choice within the UI. When closed, only the
 * selected item is visible. When users click the drop-down button, all the options become visible.
 *
 * To change the value, users open the list and click another value or use the arrow keys (up and down) to
 * select a new value.
 *
 * Note: Use either the 'value' parameter or the 'values' parameter. Setting the 'values' parameter renders a
 * multi-select dropdown.
 */
export interface Dropdown {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** A string that provides a brief hint to the user as to what kind of information is expected in the field. */
  placeholder?: S
  /** The name of the selected choice. */
  value?: S
  /** The names of the selected choices. If this parameter is set, multiple selections will be allowed. */
  values?: S[]
  /** The choices to be presented. */
  choices?: Choice[]
  /** True if this is a required field. */
  required?: B
  /** True if this field is disabled. */
  disabled?: B
  /** True if the form should be submitted when the dropdown value changes. */
  trigger?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XDropdown = bond(({ model: m }: { model: Dropdown }) => {
    const isMultivalued = !!m.values
    wave.args[m.name] = isMultivalued
      ? (m.values || [])
      : (m.value || null)

    const
      selection = isMultivalued ? new Set<S>(m.values) : null,
      selectedOptionsB = box(Array.from(selection || [])),
      options = (m.choices || []).map(({ name, label, disabled }): Fluent.IDropdownOption => ({ key: name, text: label || name, disabled })),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IDropdownOption) => {
        if (option) {
          const name = option.key as S
          if (isMultivalued && selection !== null) {
            if (option.selected) {
              selection.add(name)
            } else {
              selection.delete(name)
            }
            const selectedOpts = Array.from(selection)
            wave.args[m.name] = selectedOpts
            selectedOptionsB(selectedOpts)
          } else {
            wave.args[m.name] = name
          }
        }
        if (m.trigger) wave.push()
      },
      selectAll = () => {
        if (!selection) return

        selection.clear()
        options.forEach(o => { if (!o.disabled) selection.add(o.key as S) })

        const selectionArr = Array.from(selection)
        selectedOptionsB(selectionArr)
        wave.args[m.name] = selectionArr

        onChange()
      },
      deselectAll = () => {
        if (!selection) return

        selection.clear()
        selectedOptionsB([])
        wave.args[m.name] = []

        onChange()
      },
      render = () =>
        <>
          <Fluent.Dropdown
            data-test={m.name}
            label={m.label}
            placeholder={m.placeholder}
            options={options}
            required={m.required}
            disabled={m.disabled}
            multiSelect={isMultivalued || undefined}
            defaultSelectedKey={!isMultivalued ? m.value : undefined}
            selectedKeys={isMultivalued ? selectedOptionsB() : undefined}
            onChange={onChange}
          />
          {
            isMultivalued &&
            <div>
              <Fluent.Text variant='small'>
                <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
              </Fluent.Text>
            </div>
          }
        </>

    return { render, selectedOptionsB }
  })