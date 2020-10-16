import * as Fluent from '@fluentui/react'
import React from 'react'
import { F, S, B } from './qd'
import { displayMixin } from './theme'

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
  /** The text displayed above the bar. */
  label: S
  /** The text displayed below the bar. */
  caption?: S
  /** The progress, between 0.0 and 1.0, or -1 (default) if indeterminate. */
  value?: F
  /** Controls visibility of the component. Persists component state on show/hide. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}

export const
  XProgress = ({ model }: { model: Progress }) => {
    const
      { label, caption = 'Please wait...', value, visible } = model
    return (
      <div data-test={name} style={displayMixin(visible)}>
        <Fluent.ProgressIndicator
          label={label}
          description={caption}
          percentComplete={value}
        />
      </div>
    )
  }