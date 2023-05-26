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
import { B, box, Id, S, U } from 'h2o-wave'
import React from 'react'
import { Component, XComponents } from './form'
import { grid } from './layout'
import { Markdown } from './markdown'
import { css, notificationTypes, toMessageBarType } from './message_bar'
import { important, pc } from './theme'
import { bond, wave } from './ui'

/**
 * Create a notification bar.
 *
 * A notification bar is an area at the edge of a primary view that displays relevant status information.
 * You can use a notification bar to tell the user about a result of an action, e.g. "Data has been successfully saved".
 */
export interface NotificationBar {
  /** The text displayed on the notification bar. */
  text: S
  /** The icon and color of the notification bar. Defaults to 'info'. */
  type?: 'info' | 'error' | 'warning' | 'success' | 'danger' | 'blocked'
  /** How long the notification stays visible, in seconds. If set to -1, the notification has to be closed manually. Defaults to 5. */
  timeout?: U
  /** Specify one or more action buttons. */
  buttons?: Component[]
  /** Specify the location of notification. Defaults to 'top-right'. */
  position?: 'top-right' | 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-left' | 'top-center'
  /** The events to capture on this notification bar. One of 'dismissed'. */
  events?: S[]
  /** An identifying name for this component. */
  name?: Id
}

const
  gap = grid.gap,
  isMessagebarMultiline = (text?: S, buttons?: Component[]) => {
    const textLength = text?.length || 0
    const buttonTextLength = buttons?.reduce((prev, curr) => prev + (curr.button?.label?.length || 0) + 15, 0) || 0
    return textLength + buttonTextLength > 54
  }

export const
  notificationBarB = box<NotificationBar | null>(null),
  NotificationBar = bond(() => {
    let
      timeout: U | undefined,
      lastModel: NotificationBar | null = null
    const
      getAnimation = (shouldBeOpen: B, transform: S) => shouldBeOpen
        ? Fluent.keyframes({ from: { transform }, to: { transform: 'none' }, })
        : Fluent.keyframes({ from: { transform: 'none' }, to: { transform }, }),
      getPosition = (position = 'top-right', shouldBeOpen: B) => {
        if (window.innerWidth < 500 + gap) return position.includes('top')
          ? { top: 0, right: 0, left: 0, margin: '0 auto', animationName: getAnimation(shouldBeOpen, 'translateY(-100%)') }
          : { bottom: 0, right: 0, left: 0, margin: '0 auto', animationName: getAnimation(shouldBeOpen, 'translateY(100%)') }

        switch (position) {
          case 'top-right': return { top: gap, right: gap, animationName: getAnimation(shouldBeOpen, `translateX(calc(100% + ${gap}px))`) }
          case 'top-center': return { top: gap, right: 0, left: 0, margin: '0 auto', animationName: getAnimation(shouldBeOpen, `translateY(calc(-100% - ${gap}px))`) }
          case 'top-left': return { top: gap, left: gap, animationName: getAnimation(shouldBeOpen, `translateX(calc(-100% - ${gap}px))`) }
          case 'bottom-right': return { bottom: gap, right: gap, animationName: getAnimation(shouldBeOpen, `translateX(calc(100% + ${gap}px))`) }
          case 'bottom-center': return { bottom: gap, right: 0, left: 0, margin: '0 auto', animationName: getAnimation(shouldBeOpen, `translateY(calc(100% + ${gap}px))`) }
          case 'bottom-left': return { bottom: gap, left: gap, animationName: getAnimation(shouldBeOpen, `translateX(calc(-100% - ${gap}px))`) }
        }
      },
      onDismiss = () => {
        window.clearTimeout(timeout)
        lastModel = notificationBarB()
        const { name, events } = lastModel || {},
          ev = events?.find(e => e === 'dismissed')
        if (ev && name) wave.emit(name, ev, true)
        notificationBarB(null)
      },
      render = () => {
        const
          model = notificationBarB(),
          shouldBeOpen = !!model,
          currentModel = model || lastModel,
          { iconName, color, background } = notificationTypes[currentModel?.type || 'info'],
          buttons = currentModel?.buttons?.filter(({ button }) => button),
          isMultiline = isMessagebarMultiline(currentModel?.text, buttons)

        if (model?.timeout !== -1 && shouldBeOpen) timeout = window.setTimeout(onDismiss, (model?.timeout || 5) * 1000)

        return (
          currentModel?.text?.length
            ?
            <Fluent.MessageBar
              messageBarType={toMessageBarType(currentModel?.type)}
              messageBarIconProps={{ iconName }}
              actions={buttons?.length ? <XComponents items={buttons || []} justify='end' /> : undefined}
              isMultiline={isMultiline}
              onDismiss={onDismiss}
              className={css.messageBar}
              styles={{
                root: {
                  background,
                  color,
                  borderRadius: 4,
                  '.ms-Link': { color, fontWeight: 600 },
                  '.ms-Link:hover': { textDecoration: 'none', color },
                  padding: 16,
                  minHeight: 24,
                  position: 'fixed',
                  animationDuration: '0.5s',
                  animationFillMode: 'forwards',
                  maxWidth: 500,
                  width: pc(100),
                  zIndex: 5, // Needs to be higher than z-index of ui.time_picker
                  ...getPosition(currentModel?.position, shouldBeOpen)
                },
                content: { alignItems: isMultiline ? 'start' : 'center' },
                icon: { fontSize: 24, color, display: 'inline-flex' },
                iconContainer: { margin: 0, marginRight: 16, display: 'flex', alignItems: 'center' },
                text: { margin: 0 },
                innerText: { whiteSpace: important('initial') },
                dismissal: { fontSize: 16, height: 'auto', marginLeft: 16, padding: 0, '.ms-Button-flexContainer': { display: 'block' } },
                dismissSingleLine: { display: 'flex' },
                actions: { margin: 0, marginTop: isMultiline ? 12 : undefined }
              }}
            >
              <Markdown source={currentModel?.text} />
            </Fluent.MessageBar>
            : <></>
        )
      },
      dispose = () => window.clearTimeout(timeout)

    return { render, notificationBarB, dispose }
  }) 