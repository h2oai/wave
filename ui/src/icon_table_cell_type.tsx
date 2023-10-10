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
import { S } from './core'
import React from 'react'

/**
 * Create a cell type that renders a column's cells as icons instead of plain text.
 * If set on a column, the cell value is interpreted as the name of the icon to be displayed.
*/
export interface IconTableCellType {
  /** Icon color. */
  color?: S
  /** An identifying name for this component. */
  name?: S
}

export const XIconTableCellType = ({ model: m, icon }: { model: IconTableCellType, icon: S }) => (
  <Fluent.Icon data-test={m.name} iconName={icon} styles={{ root: { fontSize: '1.2rem', color: m.color || 'inherit' } }} />
)
