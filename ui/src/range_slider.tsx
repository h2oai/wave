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
import { B, box, F, Id, S, U } from 'h2o-wave'
import React from 'react'
import InputRange, { Range } from 'react-input-range'
import 'react-input-range/lib/css/index.css'
import { stylesheet } from 'typestyle'
import { padding } from './theme'
import { bond, wave } from './ui'

const
  css = stylesheet({
    container: {
      padding: padding(0, 8),
      $nest: {
        '.input-range': {
          marginTop: 15,
          marginBottom: 35,
          $nest: {
            '&__slider': {
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'var(--neutralPrimary)',
              background: 'var(--white)',
              width: 16,
              height: 16,
              boxSizing: 'border-box',
              cursor: 'initial',
              $nest: {
                '&:active': {
                  transform: 'none'
                }
              }
            },
            '&__label': {
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600
            },
            '&__label-container': {
              color: 'var(--neutralPrimary)'
            },
            '&__track': {
              height: 4,
              borderRadius: 4,
              background: 'var(--neutralTertiaryAlt)',
              cursor: 'initial',
              $nest: {
                '&--active': {
                  background: 'var(--neutralSecondary)',
                },
              }
            },
          }
        },
        '&:active .input-range': {
          $nest: {
            '&__slider': {
              borderColor: 'var(--themeDark)',
            },
            '&__track': {
              background: 'var(--themeLighter)',
            },
            '&__track--active': {
              background: 'var(--themeDark)',
            },
          }
        },
        '&:hover .input-range': {
          $nest: {
            '&__slider': {
              borderColor: 'var(--themePrimary)',
            },
            '&__track': {
              background: 'var(--themeLighter)',
            },
            '&__track--active': {
              background: 'var(--themePrimary)',
            },
          }
        },
      }
    },
    disabled: {
      opacity: 0.5
    }
  })

/**
 * Create a range slider.
 *
 * A range slider is an element used to select a value range. It provides a visual indication of adjustable content, as well as the
 * current setting in the total range of content. It is displayed as a horizontal track with options on either side.
 * Knobs or levers are dragged to one end or the other to make the choice, indicating the current max and min value.
 *
*/
export interface RangeSlider {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** The minimum value of the slider. Defaults to 0. */
  min?: F
  /** The maximum value of the slider. Defaults to 100. */
  max?: F
  /** The difference between two adjacent values of the slider. */
  step?: F
  /** The lower bound of the selected range. */
  min_value?: F
  /** The upper bound of the selected range. */
  max_value?: F
  /** True if this field is disabled. */
  disabled?: B
  /** True if the form should be submitted when the slider value changes. */
  trigger?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const XRangeSlider = bond(({ model: m }: { model: RangeSlider }) => {
  const
    { min = 0, max = 100, step = 1 } = m,
    value = {
      min: (m.min_value && m.min_value > min && m.min_value <= max) ? m.min_value : min,
      max: (m.max_value && m.max_value > min && m.max_value <= max) ? m.max_value : max
    }

  wave.args[m.name] = Object.values(value as Range)

  const
    valueB = box<Range>(value),
    onChange = (val: Range | U) => {
      valueB(val as Range)
      wave.args[m.name] = Object.values(val as Range)
      if (m.trigger) wave.push()
    },
    render = () => (
      <div data-test={m.name}>
        {m.label && <Fluent.Label disabled={m.disabled}>{m.label}</Fluent.Label>}
        <div className={`${css.container} ${m.disabled ? css.disabled : ''}`}>
          <InputRange maxValue={max} minValue={min} step={step} disabled={m.disabled} allowSameValues value={valueB()} onChange={onChange} />
        </div>
      </div>
    )
  return { render, valueB }
})