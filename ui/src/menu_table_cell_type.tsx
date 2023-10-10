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

import { S } from './core'
import { Command, toCommands } from "./toolbar"
import React from 'react'
import { stylesheet } from "typestyle"
import * as Fluent from '@fluentui/react'
import { border, cssVar } from "./theme"
import { fixMenuOverflowStyles } from './parts/utils'

/**
 * Create a cell type that renders command menu.
 *
 * Commands are typically displayed as context menu items. Useful when you need to provide
 * multiple actions within a single row.
 */
export interface MenuTableCellType {
  /** Items to render. */
  commands: Command[]
  /** An identifying name for this component. */
  name?: S
}

const css = stylesheet({
  container: {
    display: 'inline',
    cursor: 'pointer',
  },
  icon: {
    fontSize: 18
  }
})

export const XMenuTableCellType = ({ model }: { model: MenuTableCellType & { rowId: string } }) => {
  const
    ref = React.useRef<HTMLDivElement>(null),
    [isMenuHidden, setIsMenuHidden] = React.useState(true),
    open = () => setIsMenuHidden(false),
    close = () => setIsMenuHidden(true)

  return (
    <div data-test={model.name} className={css.container} ref={ref} onClick={open}>
      <Fluent.FontIcon className={css.icon} iconName="MoreVertical" />
      <Fluent.ContextualMenu
        items={toCommands(model.commands.map(i => ({ ...i, value: model.rowId })))}
        target={ref}
        hidden={isMenuHidden}
        onDismiss={close}
        isBeakVisible
        directionalHint={Fluent.DirectionalHint.bottomCenter}
        calloutProps={{ styles: { beak: { border: border(1, cssVar('$neutralQuaternaryAlt')) } } }}
        styles={fixMenuOverflowStyles}
      />
    </div>
  )
}