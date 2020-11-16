import React from 'react'
import { bond, qd, S, B } from './qd'
import * as Fluent from '@fluentui/react'
import { XComponents, Component } from './form'

/**
 * A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
 * and requires people to interact with it. It’s primarily used for confirming actions,
 * such as deleting a file, or asking people to make a choice.
 */
export interface Dialog {
  /** An identifying name for this component. */
  name: S
  /** The title of the dialog. */
  title: S
  /** The form components in the dialog. */
  items: Component[]
  /** True if the dialog submit button should be disabled. */
  disabled?: B
  /** Width of the dialog. E.g. '400px', defaults to '600px'. */
  width?: S
  /** True if the dialog should have closing 'X' button in top right corner. */
  has_x?: B
  /** Text displayed on submit button. Defaults to 'Submit'. */
  submitText?: S
  /** Text displayed on cancel button. Defaults to 'Cancel'. */
  cancelText?: S
}

export default bond(() => {
  const
    { dialogB } = qd,
    toggleDialog = () => dialogB(null),
    submit = () => {
      qd.args[dialogB()!.name] = true
      qd.sync()
      toggleDialog()
    },
    render = () => {
      const dialog = dialogB()
      if (!dialog) return <></>
      const
        { title, cancelText = 'Cancel', submitText = 'Submit', width = '600px', items, disabled, has_x } = dialog,
        dialogContentProps: Fluent.IDialogContentProps = { title, type: has_x ? Fluent.DialogType.close : undefined }

      return (
        <Fluent.Dialog hidden={!dialog} dialogContentProps={dialogContentProps} minWidth={width} maxWidth={width} onDismiss={toggleDialog}>
          <XComponents items={items} />
          <Fluent.DialogFooter>
            <Fluent.DefaultButton onClick={toggleDialog} text={cancelText} />
            <Fluent.PrimaryButton onClick={submit} text={submitText} disabled={disabled} />
          </Fluent.DialogFooter>
        </Fluent.Dialog>
      )
    }
  return { render, dialogB }
})