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
import { B, Box, box, S, U } from 'h2o-wave'
import React from 'react'
import { Component } from './form'
import { MessageBar } from "./message_bar"
import { bond } from './ui'

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
  /** When should the notification bar disappear in seconds. Defaults to 5. */
  timeout?: U
  /** Specify one or more action buttons. */
  buttons?: Component[]
  /** Specify the location of notification. Defaults to 'top-right'. */
  position?: 'top-right' | 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-left' | 'top-center'
  /** The events to capture on this notification bar. */
  events?: S[]
}

const gap = 15

export const
  notificationBarB: Box<NotificationBar | null> = box(null),
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
        notificationBarB(null)
      },
      render = () => {
        const
          model = notificationBarB(),
          shouldBeOpen = !!model,
          currentModel = model || lastModel,
          extraStyles: Fluent.IRawStyle = {
            position: 'fixed',
            animationDuration: '0.5s',
            animationFillMode: 'forwards',
            ...getPosition(currentModel?.position, shouldBeOpen)
          }

        if (!model?.buttons && shouldBeOpen) timeout = window.setTimeout(onDismiss, model?.timeout || 5000)

        return <MessageBar type={currentModel?.type} text={currentModel?.text} buttons={currentModel?.buttons} extraStyles={extraStyles} onDismiss={onDismiss} />
      },
      dispose = () => window.clearTimeout(timeout)

    return { render, notificationBarB, dispose }
  }) 