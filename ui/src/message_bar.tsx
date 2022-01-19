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
import { B, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { Markdown } from './markdown'
import { important, margin, pc, px } from './theme'

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
  /** Specify one or more action buttons. */
  buttons?: Component[]
  /** The width of the message bar, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
}

const
  css = stylesheet({
    messageBar: {
      $nest: {
        // Adjust spacing to align with Fluent Messagebar icon.
        '.wave-markdown > *:first-child': { marginTop: 0 },
        '.wave-markdown > *:only-child': { marginBottom: 0 },
        '.wave-markdown p': { fontSize: 14, lineHeight: px(20), letterSpacing: '-0.006em' },
        '.ms-MessageBar-dismissal .ms-Button-icon': { fontSize: 16 },
      }
    }
  })

type NotificationType = 'info' | 'error' | 'warning' | 'success' | 'danger' | 'blocked'
type NotificationStyle = {
  iconName: S
  background: S
  color: S
}
type MessagebarProps = {
  type?: NotificationType
  text?: S
  buttons?: Component[]
  name?: S
  extraStyles?: Fluent.IRawStyle
  onDismiss?: () => void
}

const
  notificationTypes: { [K in NotificationType]: NotificationStyle } = {
    'info': {
      iconName: 'InfoSolid',
      background: '#DBEEFD',
      color: '#165589'
    },
    'error': {
      iconName: 'StatusErrorFull',
      background: '#F1CBCB',
      color: '#5E0000'
    },
    'warning': {
      iconName: 'IncidentTriangle',
      background: '#FFF6DC',
      color: '#8F7015'
    },
    'success': {
      iconName: 'CompletedSolid',
      background: '#CAEACA',
      color: '#094609'
    },
    'danger': {
      iconName: 'IncidentTriangle',
      background: '#F1CBCB',
      color: '#5E0000'
    },
    'blocked': {
      iconName: 'Blocked2Solid',
      background: '#F1CBCB',
      color: '#5E0000'
    },
  },
  toMessageBarType = (t?: S): Fluent.MessageBarType => {
    switch (t) {
      case 'error': return Fluent.MessageBarType.error
      case 'warning': return Fluent.MessageBarType.warning
      case 'success': return Fluent.MessageBarType.success
      case 'danger': return Fluent.MessageBarType.severeWarning
      case 'blocked': return Fluent.MessageBarType.blocked
      default: return Fluent.MessageBarType.info
    }
  },
  isMessagebarMultiline = (text?: S, buttons?: Component[]) => {
    const textLength = text?.length || 0
    const buttonTextLength = buttons?.filter(({ button }) => button).reduce((prev, curr) => prev + (curr.button?.label?.length || 0) + 15, 0) || 0
    return textLength + buttonTextLength > 54
  }

export const
  MessageBar = ({ type, text, buttons, name, extraStyles = {}, onDismiss }: MessagebarProps) => {
    const { iconName, color, background } = notificationTypes[type || 'info']
    const isMultiline = isMessagebarMultiline(text, buttons)
    return (
      text?.length
        ? (
          <Fluent.MessageBar
            data-test={name}
            styles={{
              root: {
                background,
                color,
                borderRadius: 4,
                maxWidth: 500,
                width: pc(100),
                animationFillMode: 'forwards',
                '.ms-Link': { color, fontWeight: 600 },
                '.ms-Link:hover': { textDecoration: 'none', color },
                ...extraStyles
              },
              content: { alignItems: isMultiline ? 'start' : 'center' },
              icon: { fontSize: 24, color },
              iconContainer: { margin: margin(16, 16, 16, 24), display: 'flex', alignItems: 'center' },
              text: { margin: margin(16, 0) },
              innerText: { whiteSpace: important('initial') },
              dismissal: { fontSize: 16, height: 'auto', margin: margin(16, 16, 16, 0), padding: 0, '.ms-Button-flexContainer': { display: 'block' } },
              dismissSingleLine: { display: 'flex' },
              actions: { margin: 16, marginTop: isMultiline ? 0 : undefined }
            }}
            messageBarType={toMessageBarType(type)}
            onDismiss={onDismiss}
            className={css.messageBar}
            isMultiline={isMultiline}
            actions={buttons ? <XComponents items={buttons || []} alignment='end' /> : undefined}
            messageBarIconProps={{ iconName }}
          >
            <Markdown source={text} />
          </Fluent.MessageBar>
        )
        : null
    )
  },
  XMessageBar = ({ model: m }: { model: MessageBar }) => <MessageBar name={m.name} text={m.text} type={m.type} buttons={m.buttons} />