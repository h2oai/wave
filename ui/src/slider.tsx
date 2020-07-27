import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, F, S, qd } from './qd';

/**
 * Create a slider.
 *
 * A slider is an element used to set a value. It provides a visual indication of adjustable content, as well as the
 * current setting in the total range of content. It is displayed as a horizontal track with options on either side.
 * A knob or lever is dragged to one end or the other to make the choice, indicating the current value.
 * Marks on the slider bar can show values and users can choose where they want to drag the knob or lever to
 * set the value.
 *
 * A slider is a good choice when you know that users think of the value as a relative quantity, not a numeric value.
 * For example, users think about setting their audio volume to low or medium — not about setting the
 * value to two or five.
 *
 * The default value of the slider will be zero or be constrained to the min and max values. The min will be returned
 * if the value is set under the min and the max will be returned if set higher than the max value.
*/
export interface Slider {
  /** An identifying name for this component. */
  name: S
  /** Text to be displayed alongside the component. */
  label?: S
  /** The minimum value of the slider. */
  min?: F
  /** The maximum value of the slider. */
  max?: F
  /** The difference between two adjacent values of the slider. */
  step?: F
  /** The current value of the slider. */
  value?: F
  /** True if this field is disabled. */
  disabled?: B
  /** True if the form should be submitted when the slider value changes. */
  trigger?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XSlider = bond(({ model: m }: { model: Slider }) => {
    const
      min = m.min || 0,
      max = m.max || 100,
      step = m.step || 1,
      value = m.value || 0

    const defaultValue = (value < min) ? min : ((value > max) ? max : value)
    qd.args[m.name] = defaultValue
    const
      onChange = (v: number) => qd.args[m.name] = v,
      onChanged = (_event: MouseEvent | KeyboardEvent | TouchEvent, _value: number) => {
        if (m.trigger) qd.sync()
      },
      render = () => (
        <Fluent.Slider
          data-test={m.name}
          buttonProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
          label={m.label}
          min={min}
          max={max}
          step={step}
          defaultValue={defaultValue}
          showValue={true}
          originFromZero={min < 0 && max >= 0}
          onChange={onChange}
          onChanged={onChanged}
          disabled={m.disabled}
        />
      )

    return { render }
  })