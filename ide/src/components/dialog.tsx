import React from 'react';
import { bond, store } from '@/dataflow';
import * as Fluent from '@fluentui/react'

export default bond(() => {
  const
    { dialogB } = store,
    toggleDialog = () => dialogB(null),
    render = () => {
      const dialog = dialogB()
      return (
        <Fluent.Dialog hidden={!dialog} dialogContentProps={{ title: dialog?.title }} minWidth={600}>
          {dialog?.content}
          <Fluent.DialogFooter>
            <Fluent.DefaultButton onClick={toggleDialog} text="Cancel" />
            {dialog?.footer}
          </Fluent.DialogFooter>
        </Fluent.Dialog>
      )
    }
  return { render, dialogB }
})