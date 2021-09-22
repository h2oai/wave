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

import { FontIcon } from '@fluentui/react'
import { S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cssVar } from './theme'

const
  iconSize = 28,
  css = stylesheet({
    icon: {
      verticalAlign: 'middle',
      height: iconSize,
      width: iconSize,
      fontSize: iconSize,
    },
    notification: {
      position: 'relative',
      display: 'inline-block',
      marginLeft: 12,
      marginRight: 12,
    },
    badge: {
      position: 'absolute',
      height: 16,
      width: 16,
      top: -8,
      right: -8,
      borderRadius: '50%',
      verticalAlign: 'middle',
      alignContent: 'center',
      textAlign: 'center',
      fontSize: 11,
      fontWeight: 'bold',
      color: 'black',
      background: cssVar("$themeLighterAlt"),
      border: `2px solid ${cssVar("$text")}`
    }
  })

/** Create an icon with a notification badge. */
export interface IconNotification {
  /** Icon. */
  icon: S
  /** Number of notifications */
  notification_count: S
  /** The icon's color. */
  icon_color?: S
  /** An identifying name for this component. */
  name?: S
}

export const
  XIconNotification = ({ model }: { model: IconNotification }) => {
    const { icon, notification_count, icon_color, name } = model
    return <div data-test={model.name} className={css.notification}>
      <FontIcon key={name} className={css.icon} iconName={icon ?? 'WebComponents'} style={{color: cssVar(icon_color)}} />
      <span className={css.badge}>{notification_count}</span>
    </div> 
  }