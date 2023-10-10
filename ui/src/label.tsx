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
import { B, S } from './core'
import React from 'react'

/**
 * Create a label.
 *
 * Labels give a name or title to a component or group of components.
 * Labels should be in close proximity to the component or group they are paired with.
 * Some components, such as textboxes, dropdowns, or toggles, already have labels
 * incorporated, but other components may optionally add a Label if it helps inform
 * the user of the component’s purpose.
*/
export interface Label {
  /**  The text displayed on the label.*/
  label: S
  /** True if the field is required. */
  required?: B
  /** True if the label should be disabled. */
  disabled?: B
  /** The width of the label , e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}

export const
  XLabel = ({ model }: { model: Label }) => {
    const { label, required = false, disabled = false, name } = model
    return <Fluent.Label data-test={name} required={required} disabled={disabled} >{label}</Fluent.Label>
  }