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

import { S } from "h2o-wave"
import { Command } from "./toolbar"
import React from 'react'
import { XMenu } from "./menu"

/**
 * Create a cell type that renders command menu.
 *
 * Commands are typically displayed as context menu items. Useful when you need to provide
 * multiple actions within a single row.
 */
 export interface CommandTableCellType {
  /** Items to render. */
  items: Command[]
 /** An identifying name for this component. */
  name?: S
 }


export const XCommandTableCellType = ({ model }: { model: CommandTableCellType & { rowId: string } }) => {
  return <XMenu model={{ name: model.name, items: model.items.map(i => ({...i, value: model.rowId })), icon: 'More', hideCaret: true }}/>
}