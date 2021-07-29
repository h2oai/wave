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
import { bond, debounce, wave } from './ui'

/**
 * Create a text box.
 *
 * The text box component enables a user to type text into an app.
 * It's typically used to capture a single line of text, but can be configured to capture multiple lines of text.
 * The text displays on the screen in a simple, uniform format.
*/
export interface Textbox {
  /** An identifying name for this component. */
  name: Id
  /** The text displayed above the field. */
  label?: S
  /** A string that provides a brief hint to the user as to what kind of information is expected in the field. It should be a word or short phrase that demonstrates the expected type of data, rather than an explanatory message. */
  placeholder?: S
  /** Text to be displayed inside the text box. */
  value?: S
  /** The masking string that defines the mask's behavior. A backslash will escape any character. Special format characters are: '9': [0-9] 'a': [a-zA-Z] '*': [a-zA-Z0-9].*/
  mask?: S
  /** Icon displayed in the far right end of the text field. */
  icon?: S
  /** Text to be displayed before the text box contents. */
  prefix?: S
  /** Text to be displayed after the text box contents. */
  suffix?: S
  /** Text to be displayed as an error below the text box. */
  error?: S
  /** True if the text box is a required field. */
  required?: B
  /** True if the text box is disabled. */
  disabled?: B
  /** True if the text box is a read-only field. */
  readonly?: B
  /** True if the text box should allow multi-line text entry. */
  multiline?: B
  /** True if the text box should hide text content. */
  password?: B
  /** True if the form should be submitted when the text value changes. */
  trigger?: B
  /** The height of the text box, e.g. '100px'. Applicable only if `multiline` is true. */
  height?: S
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const DEBOUNCE_TIMEOUT = 500
export const
  XTextbox = bond(({ model: m }: { model: Textbox }) => {
    wave.args[m.name] = m.value || ''
    const
      onChange = ({ target }: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, v?: string) => {
        v = v || (target as HTMLInputElement).value

        wave.args[m.name] = v ?? (m.value || '')
        if (m.trigger) wave.push()
      },
      render = () => m.mask
        ? (
          <Fluent.MaskedTextField
            data-test={m.name}
            label={m.label}
            defaultValue={m.value}
            mask={m.mask}
            errorMessage={m.error}
            required={m.required}
            disabled={m.disabled}
            readOnly={m.readonly}
            onChange={m.trigger ? debounce(DEBOUNCE_TIMEOUT, onChange) : onChange}
          />
        )
        : (
          <Fluent.TextField
            data-test={m.name}
            styles={m.multiline && m.height ? { fieldGroup: { height: m.height } } : undefined}
            label={m.label}
            placeholder={m.placeholder}
            iconProps={{ iconName: m.icon }}
            prefix={m.prefix}
            suffix={m.suffix}
            defaultValue={m.value}
            errorMessage={m.error}
            required={m.required}
            disabled={m.disabled}
            readOnly={m.readonly}
            multiline={m.multiline}
            type={m.password ? 'password' : undefined}
            onChange={m.trigger ? debounce(DEBOUNCE_TIMEOUT, onChange) : onChange}
          />
        )

    return { render }
  })