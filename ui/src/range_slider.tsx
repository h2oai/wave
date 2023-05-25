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
import { B, F, Id, S, U } from 'h2o-wave'
import React from 'react'
import { wave } from './ui'

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
  /** The upper bound of the selected range. Default value is `max`. */
  max_value?: F
  /** True if this field is disabled. */
  disabled?: B
  /** The width of the range slider, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the form should be submitted when the slider value changes. */
  trigger?: B
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const XRangeSlider = ({ model }: { model: RangeSlider }) => {
  const
    { min = 0, max = 100, step = 1, min_value, max_value = max, disabled, trigger, name, label, width = 200 } = model,
    onChange = React.useCallback((_val: U, val_range?: [U, U]) => { if (val_range) wave.args[name] = val_range }, [name]),
    onChanged = React.useCallback(() => { if (trigger) wave.push() }, [trigger])

  React.useEffect(() => {
    wave.args[name] = [
      typeof min_value == 'number' && min_value > min && min_value <= max ? min_value : min,
      typeof max_value == 'number' && max_value > min && max_value <= max ? max_value : max,
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div data-test={name}>
      <Fluent.Slider
        ranged
        max={max}
        min={min}
        step={step}
        label={label}
        defaultLowerValue={min_value}
        defaultValue={max_value}
        disabled={disabled}
        onChange={onChange}
        onChanged={onChanged}
        styles={{ root: { width, minWidth: model.width ? undefined : '100%' } }}
      />
    </div>
  )
}