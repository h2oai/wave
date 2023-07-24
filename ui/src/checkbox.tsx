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
import { wave } from './ui'

/**
 * Create a checkbox.
 *
 * A checkbox allows users to switch between two mutually exclusive options (checked or unchecked, on or off) through
 * a single click or tap. It can also be used to indicate a subordinate setting or preference when paired with another
 * component.
 *
 * A checkbox is used to select or deselect action items. It can be used for a single item or for a list of multiple
 * items that a user can choose from. The component has two selection states: unselected and selected.
 *
 * For a binary choice, the main difference between a checkbox and a toggle switch is that the checkbox is for status
 * and the toggle switch is for action.
 *
 * Use multiple checkboxes for multi-select scenarios in which a user chooses one or more items from a group of
 * choices that are not mutually exclusive.
 */
export interface Checkbox {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the checkbox. */
  label?: S
  /** True if selected, False if unselected. */
  value?: B
  /** True if the selection is indeterminate (neither selected nor unselected). */
  indeterminate?: B
  /** True if the checkbox is disabled. */
  disabled?: B
  /** True if the form should be submitted when the checkbox value changes. */
  trigger?: B
  /** The width of the checkbox, e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XCheckbox = ({ model: m }: { model: Checkbox }) => {
    const
      { name, label, value = false, indeterminate, disabled, trigger } = m,
      [checked, setChecked] = React.useState(value),
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: B) => {
        wave.args[name] = checked === null ? null : !!checked
        setChecked(!!checked)
        if (trigger) wave.push()
      }

    React.useEffect(() => {
      wave.args[name] = value
      setChecked(value)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
      <Fluent.Checkbox
        data-test={name}
        inputProps={{ 'data-test': name } as React.ButtonHTMLAttributes<HTMLButtonElement>}
        styles={{ checkmark: { display: 'flex' } }} // Fix: Center the checkmark in the checkbox.
        label={label}
        defaultIndeterminate={indeterminate}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    )
  }