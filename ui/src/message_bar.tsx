import * as Fluent from '@fluentui/react'
import React from 'react'
import { S } from './qd'

/**
 * Create a message bar.
 *
 * A message bar is an area at the top of a primary view that displays relevant status information.
 * You can use a message bar to tell the user about a situation that does not require their immediate attention and
 * therefore does not need to block other activities.
 */
export interface MessageBar {
  /** The icon and color of the message bar. */
  type?: 'info' | 'error' | 'warning' | 'success' | 'danger' | 'blocked'
  /** The text displayed on the message bar. */
  text?: S
  /** An identifying name for this component. */
  name?: S
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
    m.text?.length
      ? (
        <Fluent.MessageBar
          data-test={m.name}
          messageBarType={toMessageBarType(m.type as S)} >{m.text}</Fluent.MessageBar>
      )
      : <div />
  )