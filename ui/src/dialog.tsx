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
import { B, Box, box, S, wave, Id } from 'h2o-wave'
import React from 'react'
import { Component, XComponents } from './form'
import { bond } from './ui'

export const dialogB: Box<Dialog | null> = box(null)

/**
 * A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
 * and requires people to interact with it. It’s primarily used for confirming actions,
 * such as deleting a file, or asking people to make a choice.
 */
export interface Dialog {
  /** The dialog's title. */
  title: S
  /** The components displayed in this dialog. */
  items: Component[]
  /** The width of the dialog, e.g. '400px', defaults to '600px'. */
  width?: S
  /** True if the dialog should have a closing 'X' button at the top right corner. */
  closable?: B
  /** True to disable all actions and commands behind the dialog. Blocking dialogs should be used very sparingly, only when it is critical that the user makes a choice or provides information before they can proceed. Blocking dialogs are generally used for irreversible or potentially destructive tasks. Defaults to false. */
  blocking?: B
  /** Dialog with large header banner, mutually exclusive with `closable` prop. Defaults to false. */
  primary?: B
  /** An identifying name for this component. */
  name?: Id
}

export default bond(() => {
  const
    onDismiss = () => {
      const { closable, name } = dialogB() || {}
      if (closable && name) {
        wave.events[name] = { dismissed: true }
        wave.sync()
      }
      dialogB(null)
    },
    render = () => {
      const
        { title, width = '600px', items = [], closable, primary, blocking } = dialogB() || {},
        dialogContentProps: Fluent.IDialogContentProps = {
          title,
          onDismiss,
          type: closable
            ? Fluent.DialogType.close
            : primary
              ? Fluent.DialogType.largeHeader
              : Fluent.DialogType.normal
        }

      return (
        <Fluent.Dialog hidden={!dialogB()} dialogContentProps={dialogContentProps} modalProps={{ isBlocking: blocking }} minWidth={width} maxWidth={width}>
          <XComponents items={items} />
        </Fluent.Dialog>
      )
    }
  return { render, dialogB }
})