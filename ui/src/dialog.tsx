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