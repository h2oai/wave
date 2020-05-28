import * as Fluent from '@fluentui/react';
import React from 'react';
import { S } from './telesync';

export interface MessageBar {
  type: S
  text: S
}

const
  toMessageBarType = (t: S): Fluent.MessageBarType => {
    switch (t) {
      case 'error': return Fluent.MessageBarType.error
      case 'warning': return Fluent.MessageBarType.warning
      case 'success': return Fluent.MessageBarType.success
      case 'danger': return Fluent.MessageBarType.severeWarning
      case 'blocked': return Fluent.MessageBarType.blocked
      default: return Fluent.MessageBarType.info
    }
  }

export const
  XMessageBar = ({ model: m }: { model: MessageBar }) => (
    m.text && m.text.length
      ? <Fluent.MessageBar data-test='message-bar' messageBarType={toMessageBarType(m.type)} >{m.text}</Fluent.MessageBar>
      : <div />
  )