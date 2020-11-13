import React from 'react'
import { bond, qd } from '../qd'
import * as Fluent from '@fluentui/react'
import { XComponents } from '../form'

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