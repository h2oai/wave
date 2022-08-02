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

import { B, Id, S, U } from 'h2o-wave'
import React from 'react'
// import { wave } from './ui'

/**
 * Create a timepicker.
 *
 * TODO: description
 */

export interface TimePicker {
    /** An identifying name for this component. */
    name: Id
    /** Text to be displayed alongside the component. */
    label?: S
    /** Default time selected. E.g. '10:30' */
    value?: S
    /** True if this field is disabled. */
    disabled?: B
    /** The width of the combobox, e.g. '100px'. Defaults to '100%'. */
    width?: S
    /** True if the component should be visible. Defaults to True. */
    visible?: B
    /** True if the choice should be submitted when an item from the dropdown is selected or the textbox value changes. */
    trigger?: B
    /** True if this is a required field. Defaults to False. */
    required?: B
    /** If true, use 12-hour time format. Otherwise, use 24-hour format.*/
    useHour12?: S // enum
    /** Minimum time for time options in hours (inclusive), e.g. 9 */
    min?: U
    /** Maximum time for time options n hours (exclusive), e.g. 18 */
    max?: U
}

export const
    XTimePicker = ({ model: m }: { model: TimePicker }) => {

        return (
            <div>{m.name}</div>
        )
    }