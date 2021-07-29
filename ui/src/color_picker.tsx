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
 * Create a color picker.
 *
 * A date picker allows a user to pick a color value.
 * If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.
 */
export interface ColorPicker {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** The selected color (CSS-compatible string). */
  value?: S
  /** A list of colors (CSS-compatible strings) to limit color choices to. */
  choices?: S[]
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** True if the form should be submitted when the color picker value changes. */
  trigger?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  toColorCells = (cs: S[]) => cs.map((c): Fluent.IColorCellProps => ({ id: c, label: c, color: c }))

export const
  XColorPicker = bond(({ model: m }: { model: ColorPicker }) => {
    const value = m.value || null
    wave.args[m.name] = value
    const
      onColorChanged = (_id?: string, color?: string) => {
        wave.args[m.name] = color || value

        if (m.trigger) wave.push()
      },
      onChange = (_e: React.SyntheticEvent<HTMLElement>, color: Fluent.IColor) => {
        wave.args[m.name] = color?.str || value
        if (m.trigger) wave.push()
      },
      render = () => (
        <div data-test={m.name}>
          <Fluent.Label>{m.label}</Fluent.Label>
          {
            m.choices?.length
              ? <Fluent.SwatchColorPicker
                columnCount={10}
                selectedId={value || m.choices[0]}
                colorCells={toColorCells(m.choices)}
                onColorChanged={onColorChanged}
              />
              : <Fluent.ColorPicker
                color={value || '#000'}
                onChange={onChange}
              />
          }
        </div>
      )

    return { render }
  })