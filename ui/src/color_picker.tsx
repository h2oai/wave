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
import { stylesheet } from 'typestyle'
import { border, cssVar, formItemWidth, margin } from './theme'
import { wave } from './ui'

/**
 * Create a color picker.
 *
 * A color picker allows a user to pick a color value.
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
  /** True if user should be allowed to pick color transparency. Defaults to True. */
  alpha?: B
  /** True if color picker should be displayed inline (takes less space). Doesn't work with choices specified. Defaults to False. */
  inline?: B
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** True if the form should be submitted when the color picker value changes. */
  trigger?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  css = stylesheet({
    inlinePickerContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    preview: {
      width: 20,
      height: 20,
      margin: margin(0, 15),
      border: border(1, cssVar('$text')),
    },
    rhs: {
      display: 'flex',
      alignItems: 'center',
    }
  }),
  toColorCells = (cs: S[]) => cs.map((c): Fluent.IColorCellProps => ({ id: c, label: c, color: c })),
  InlineColorPicker = ({ model, onChange }: { model: ColorPicker, onChange: (...args: any) => void }) => {
    const
      [isCalloutVisible, setIsCalloutVisible] = React.useState(false),
      val = model.value || '#000',
      [color, setColor] = React.useState(Fluent.getColorFromString(val)),
      [colorText, setColorText] = React.useState(val),
      toggleCallout = () => setIsCalloutVisible(!isCalloutVisible),
      onTextChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, val = '') => {
        setColorText(val)
        if (!val?.match(/^#([0-9a-f]{3}){1,2}$/i)) return // Hex format validation.

        const fluentColor = Fluent.getColorFromString(val)!
        setColor(fluentColor)
        onChange(null, fluentColor)
      },
      changeColor = (color: Fluent.IColor) => {
        setColor(color)
        setColorText(color.str)
      },
      onColorChange = (_e: React.SyntheticEvent<HTMLElement>, color: Fluent.IColor) => {
        onChange(null, color)
        changeColor(color)
      }

    React.useEffect(() => {
      const color = Fluent.getColorFromString(val)
      if (color) changeColor(color)
      wave.args[model.name] = val
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model.value])

    return (
      <div className={css.inlinePickerContainer}>
        {model.label && <Fluent.Label>{model.label}</Fluent.Label>}
        <div className={css.rhs}>
          <div className={css.preview} style={{ background: color?.str }} onClick={toggleCallout} />
          {isCalloutVisible && (
            <Fluent.Callout directionalHint={Fluent.DirectionalHint.rightBottomEdge} target={`.${css.preview}`} onDismiss={toggleCallout} gapSpace={10}>
              <Fluent.ColorPicker alphaType={model.alpha ? 'alpha' : 'none'} color={color!} onChange={onColorChange} />
            </Fluent.Callout>
          )}
          <Fluent.TextField value={colorText} onChange={onTextChange} />
        </div>
      </div>
    )
  }

export const
  XColorPicker = ({ model }: { model: ColorPicker }) => {
    const
      { width, value, name, trigger, label, choices, alpha, inline } = model,
      defaultValue = value || null,
      [selectedColorId, setSelectedColorId] = React.useState<S | null>(defaultValue),
      onSwatchChange = (_e: React.FormEvent<HTMLElement>, _id?: S, color = defaultValue) => {
        wave.args[name] = color
        model.value = color || undefined
        setSelectedColorId(color)
        if (trigger) wave.push()
      },
      onChange = (_e: React.SyntheticEvent<HTMLElement>, { str }: Fluent.IColor) => {
        model.value = str || undefined
        wave.args[name] = str || defaultValue
        if (trigger) wave.push()
      },
      normalizedWidth = formItemWidth(width),
      minMaxWidth = !normalizedWidth?.includes('%') ? `calc(${normalizedWidth} - 35px)` : 'initial'

    React.useEffect(() => {
      wave.args[name] = defaultValue
      setSelectedColorId(defaultValue)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
      <div data-test={name}>
        {
          inline
            ? <InlineColorPicker model={model} onChange={onChange} />
            : (
              <>
                {label && <Fluent.Label>{label}</Fluent.Label>}
                {
                  choices?.length
                    ? <Fluent.SwatchColorPicker columnCount={10} selectedId={selectedColorId || choices[0]} colorCells={toColorCells(choices)} onChange={onSwatchChange} />
                    : (
                      <Fluent.ColorPicker
                        alphaType={alpha ? 'alpha' : 'none'}
                        color={defaultValue || '#000'}
                        onChange={onChange}
                        styles={{ root: { width: normalizedWidth, maxWidth: normalizedWidth }, colorRectangle: { minWidth: minMaxWidth, maxWidth: minMaxWidth } }}
                      />
                    )
                }
              </>
            )
        }
      </div>
    )
  }