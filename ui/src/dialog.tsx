import * as Fluent from '@fluentui/react'
import React from 'react'
import { XButtons } from './button'
import { Component, XComponents } from './form'
import { B, bond, qd, S } from './qd'

/**
 * A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
 * and requires people to interact with it. It’s primarily used for confirming actions,
 * such as deleting a file, or asking people to make a choice.
 */
export interface Dialog {
  /** The title of the dialog. */
  title: S
  /** The form components in the dialog. */
  items: Component[]
  /** Width of the dialog. E.g. '400px', defaults to '600px'. */
  width?: S
  /** True if the dialog should have closing 'X' button in top right corner. */
  closeable?: B
  /** A blocking Dialog disables all other actions and commands on the page behind it. Defaults to false. */
  closable?: B
  blocking?: B
  /** Dialog with large header banner, mutually exclusive with `closable` prop. Defaults to false. */
  primary?: B
}

export default bond(() => {
  const
    { dialogB } = qd,
    render = () => {
      const
        { title, width = '600px', items = [], closable, primary, blocking } = dialogB() || {},
        dialogContentProps: Fluent.IDialogContentProps = {
          title,
          type: closable
            ? Fluent.DialogType.close
            : primary
              ? Fluent.DialogType.largeHeader
              : Fluent.DialogType.normal
        },
        lastComponent = items.pop()

      return (
        <Fluent.Dialog hidden={!dialogB()} dialogContentProps={dialogContentProps} modalProps={{ isBlocking: blocking }} minWidth={width} maxWidth={width}>
          <XComponents items={items} />
          {lastComponent?.buttons && <Fluent.DialogFooter><XButtons model={lastComponent.buttons} /></Fluent.DialogFooter>}
        </Fluent.Dialog>
      )
    }
  return { render, dialogB }
})