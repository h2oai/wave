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
import { B, Box, box, Id, S } from 'h2o-wave'
import React from 'react'
import { Component, XComponents } from './form'
import { bond, wave } from './ui'
import { Z_INDEX } from './parts/styleConstants'

export const dialogB: Box<Dialog | null> = box()

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
  /** The width of the dialog, e.g. '400px'. Defaults to '600px'. */
  width?: S
  /** True if the dialog should have a closing 'X' button at the top right corner. */
  closable?: B
  /** True to prevent closing when clicking or tapping outside the dialog. Prevents interacting with the page behind the dialog. Defaults to False. */
  blocking?: B
  /** Dialog with large header banner, mutually exclusive with `closable` prop. Defaults to False. */
  primary?: B
  /** An identifying name for this component. */
  name?: Id
  /** The events to capture on this dialog. One of 'dismissed'. */
  events?: S[]
}

export const layerProps: Fluent.ILayerProps = { styles: { root: { zIndex: Z_INDEX.DIALOG } } }

export default bond(() => {
  const
    onDismiss = () => {
      const { name, events } = dialogB() || {}
      if (name) {
        events?.forEach(e => {
          if (e === 'dismissed') wave.emit(name, e, true)
        })
      }
      dialogB(null)
    },
    render = () => {
      const
        { title, width = '600px', items = [], closable, primary, blocking = false } = dialogB() || {},
        dialogContentProps: Fluent.IDialogContentProps = {
          title,
          onDismiss,
          showCloseButton: closable,
          type: closable
            ? Fluent.DialogType.close
            : primary
              ? Fluent.DialogType.largeHeader
              : Fluent.DialogType.normal
        }

      return (
        <Fluent.Dialog
          hidden={!dialogB()}
          onDismiss={onDismiss}
          dialogContentProps={dialogContentProps}
          modalProps={{ isBlocking: blocking, layerProps }}
          minWidth={width}
          maxWidth={width}>
          <XComponents items={items} />
        </Fluent.Dialog>
      )
    }
  return { render, dialogB }
})