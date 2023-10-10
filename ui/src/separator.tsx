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
import { stylesheet } from 'typestyle'

const
  css = stylesheet({
    separator: {
      boxSizing: 'border-box',
    },
  })

/**
 * Create a separator.
 *
 * A separator visually separates content into groups.
 */
export interface Separator {
  /** The text displayed on the separator. */
  label?: S
  /** An identifying name for this component. */
  name?: S
  /** The width of the separator , e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
}

export const
  XSeparator = ({ model: m }: { model: Separator }) => (
    <div data-test={m.name} className={css.separator}>
      <Fluent.Separator>{m.label}</Fluent.Separator>
    </div>
  )