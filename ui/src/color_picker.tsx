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
import { formItemWidth } from './theme'
import { wave } from './ui'

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
  /** The width of the color picker, e.g. '100px'. Defaults to '300px'. */
  width?: S
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
  XColorPicker = ({ model }: { model: ColorPicker }) => {
    const
      { width, value, name, trigger, label, choices } = model,
      defaultValue = value || null,
      onColorChanged = (_id?: S, color = defaultValue) => {
        wave.args[name] = color

        if (trigger) wave.push()
      },
      onChange = (_e: React.SyntheticEvent<HTMLElement>, { str }: Fluent.IColor) => {
        wave.args[name] = str || defaultValue
        if (trigger) wave.push()
      },
      normalizedWidth = formItemWidth(width),
      minMaxWidth = !normalizedWidth?.includes('%') ? `calc(${normalizedWidth} - 35px)` : 'initial'

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { wave.args[name] = defaultValue }, [])

    return (
      <div data-test={name}>
        <Fluent.Label>{label}</Fluent.Label>
        {
          choices?.length
            ? <Fluent.SwatchColorPicker
              columnCount={10}
              selectedId={defaultValue || choices[0]}
              colorCells={toColorCells(choices)}
              onColorChanged={onColorChanged}
            />
            : <Fluent.ColorPicker
              styles={{ root: { width: normalizedWidth, maxWidth: normalizedWidth }, colorRectangle: { minWidth: minMaxWidth, maxWidth: minMaxWidth } }}
              color={defaultValue || '#000'}
              onChange={onChange}
            />
        }
      </div>
    )
  }