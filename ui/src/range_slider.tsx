import React from 'react'
import * as Fluent from '@fluentui/react'
import { bond, box, S, qd, B, U, F } from './qd'
import InputRange, { Range } from 'react-input-range'
import 'react-input-range/lib/css/index.css'
import { stylesheet } from 'typestyle'
import { palette } from './theme'

const
  css = stylesheet({
    container: {
      paddingLeft: 8,
      paddingRight: 8,
      $nest: {
        '.input-range': {
          marginTop: 20,
          marginBottom: 25,
          $nest: {
            '&__slider': {
              borderWidth: 2,
              borderRadius: 10,
              borderColor: palette.neutralPrimary,
              background: palette.white,
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
              color: palette.neutralPrimary
            },
            '&__track': {
              height: 4,
              borderRadius: 4,
              background: palette.neutralTertiaryAlt,
              cursor: 'initial',
              $nest: {
                '&--active': {
                  background: palette.neutralSecondary,
                },
              }
            }
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
  name: S
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
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const XRangeSlider = bond(({ model: m }: { model: RangeSlider }) => {
  const
    min = m.min || 0,
    max = m.max || 100,
    step = m.step || 1,
    value = {
      min: (m.min_value && m.min_value > min && m.min_value <= max) ? m.min_value : min,
      max: (m.max_value && m.max_value > min && m.max_value <= max) ? m.max_value : max
    }

  qd.args[m.name] = Object.values(value as Range)

  const
    valueB = box<Range>(value),
    onChange = (val: Range | U) => {
      valueB(val as Range)
      qd.args[m.name] = Object.values(val as Range)
      if (m.trigger) qd.sync()
    },
    render = () => (
      <>
        {m.label && <Fluent.Label disabled={m.disabled}>{m.label}</Fluent.Label>}
        <div className={`${css.container} ${m.disabled ? css.disabled : ''}`}>
          <InputRange maxValue={max} minValue={min} step={step} disabled={m.disabled} allowSameValues value={valueB()} onChange={onChange} />
        </div>
      </>
    )
  return { render, valueB }
})