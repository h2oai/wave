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
import { displayMixin } from './theme'
import { bond, wave } from './ui'

/**
 * Create a toggle.
 * Toggles represent a physical switch that allows users to turn things on or off.
 * Use toggles to present users with two mutually exclusive options (like on/off), where choosing an option results
 * in an immediate action.
 *
 * Use a toggle for binary operations that take effect right after the user flips the Toggle.
 * For example, use a Toggle to turn services or hardware components on or off.
 * In other words, if a physical switch would work for the action, a Toggle is probably the best component to use.
 */
export interface Toggle {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** True if selected, False if unselected. */
  value?: B
  /** True if the checkbox is disabled. */
  disabled?: B
  /** True if the form should be submitted when the toggle value changes. */
  trigger?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XToggle = bond(({ model: m }: { model: Toggle }) => {
    wave.args[m.name] = !!m.value
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => {
        wave.args[m.name] = !!checked
        if (m.trigger) wave.push()
      },
      render = () => (
        <Fluent.Toggle
          data-test={m.name}
          style={displayMixin(m.visible)}
          label={m.label}
          defaultChecked={m.value}
          onChange={onChange}
          disabled={m.disabled}
          onText="On"
          offText="Off"
          inlineLabel
        />
      )

    return { render }
  })