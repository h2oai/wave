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
import { B, F, S } from './core'
import React from 'react'

/**
 * Create a progress bar.
 *
 * Progress bars are used to show the completion status of an operation lasting more than 2 seconds.
 * If the state of progress cannot be determined, do not set a value.
 * Progress bars feature a bar showing total units to completion, and total units finished.
 * The label appears above the bar, and the caption appears below.
 * The label should tell someone exactly what the operation is doing.
 *
 * Examples of formatting include:
 * [Object] is being [operation name], or
 * [Object] is being [operation name] to [destination name] or
 * [Object] is being [operation name] from [source name] to [destination name]
 *
 * Status text is generally in units elapsed and total units.
 * Real-world examples include copying files to a storage location, saving edits to a file, and more.
 * Use units that are informative and relevant to give the best idea to users of how long the operation will take to complete.
 * Avoid time units as they are rarely accurate enough to be trustworthy.
 * Also, combine steps of a complex operation into one total bar to avoid “rewinding” the bar.
 * Instead change the label to reflect the change if necessary. Bars moving backwards reduce confidence in the service.
*/

export interface Progress {
  /** The text displayed above the bar or right to the spinner. */
  label: S
  /** The text displayed below the bar or spinner. */
  caption?: S
  /** The progress, between 0.0 and 1.0, or -1 (default) if indeterminate. */
  value?: F
  /** The width of the separator, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
  /** The type of progress bar to be displayed. One of 'bar', 'spinner'. Defaults to 'bar'. */
  type?: 'bar' | 'spinner'
}

export const
  XProgress = ({ model }: { model: Progress }) => {
    const { type = 'bar', label, caption, value, name } = model
    return (
      <div data-test={name}>
        {type === 'spinner'
          ? <Fluent.Spinner
            styles={{ root: { justifyContent: 'auto' } }}
            label={caption || label}
            size={Fluent.SpinnerSize.medium}
            labelPosition={caption ? 'bottom' : 'right'}
          />
          : <Fluent.ProgressIndicator label={label} description={caption || 'Please wait...'} percentComplete={value} />}
      </div>
    )
  }