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
import { bond, wave } from './ui'

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
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XCheckbox = bond(({ model: m }: { model: Checkbox }) => {
    wave.args[m.name] = !!m.value
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => {
        wave.args[m.name] = checked === null ? null : !!checked
        if (m.trigger) wave.push()
      },
      render = () => (
        <Fluent.Checkbox
          data-test={m.name}
          inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
          label={m.label}
          defaultIndeterminate={m.indeterminate}
          defaultChecked={m.value}
          onChange={onChange}
          disabled={m.disabled}
        />
      )

    return { render }
  })